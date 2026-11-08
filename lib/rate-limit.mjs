/**
 * Fixed-window rate limiter for the AI endpoints.
 *
 * When UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (or Vercel KV's
 * KV_REST_API_URL / KV_REST_API_TOKEN) are configured, counters live in Redis so
 * the limit is shared across every serverless instance. Without those variables
 * it falls back to a bounded per-instance in-memory window, which only raises
 * cost and does not enforce a strict global quota.
 */

const buckets = new Map();
const MAX_BUCKETS = 10000;
const REDIS_TIMEOUT_MS = 2000;

function sweep(now) {
  for (const [key, bucket] of buckets) {
    if (bucket.reset <= now) buckets.delete(key);
  }
}

function memoryRateLimit(key, { limit = 30, windowMs = 60_000 } = {}) {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || bucket.reset <= now) {
    if (buckets.size >= MAX_BUCKETS) sweep(now);
    if (!buckets.has(key) && buckets.size >= MAX_BUCKETS) {
      const oldest = buckets.keys().next().value;
      if (oldest !== undefined) buckets.delete(oldest);
    }
    bucket = { count: 0, reset: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;

  return {
    allowed: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfter: Math.max(1, Math.ceil((bucket.reset - now) / 1000)),
  };
}

function redisConfig(env) {
  const url = String(env?.UPSTASH_REDIS_REST_URL || env?.KV_REST_API_URL || '')
    .trim()
    .replace(/\/+$/, '');
  const token = String(env?.UPSTASH_REDIS_REST_TOKEN || env?.KV_REST_API_TOKEN || '').trim();
  return url && token ? { url, token } : null;
}

async function redisPipeline(config, commands) {
  const res = await fetch(`${config.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
    signal: AbortSignal.timeout(REDIS_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`durable rate-limit store responded ${res.status}`);
  const payload = await res.json();
  if (!Array.isArray(payload)) throw new Error('durable rate-limit store returned an invalid response');
  return payload;
}

async function redisRateLimit(config, key, { limit, windowMs }) {
  const redisKey = `rl:${key}`;
  const [, incrResult, pttlResult] = await redisPipeline(config, [
    ['SET', redisKey, '0', 'PX', String(windowMs), 'NX'],
    ['INCR', redisKey],
    ['PTTL', redisKey],
  ]);

  const count = Number(incrResult?.result ?? 1);
  let ttl = Number(pttlResult?.result ?? -1);

  if (ttl < 0) {
    const [, refreshed] = await redisPipeline(config, [
      ['PEXPIRE', redisKey, String(windowMs)],
      ['PTTL', redisKey],
    ]);
    ttl = Number(refreshed?.result ?? windowMs);
  }

  return {
    allowed: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
    retryAfter: Math.max(1, Math.ceil((ttl > 0 ? ttl : windowMs) / 1000)),
  };
}

export async function rateLimit(key, { limit = 30, windowMs = 60_000 } = {}, env = process.env) {
  const config = redisConfig(env);
  if (!config) return memoryRateLimit(key, { limit, windowMs });

  try {
    return await redisRateLimit(config, key, { limit, windowMs });
  } catch (err) {
    console.error('[rate-limit] durable store unavailable, using in-memory fallback:', err?.message || err);
    return memoryRateLimit(key, { limit, windowMs });
  }
}

export function clientKey(req) {
  const headers = req?.headers;
  const get = (name) =>
    typeof headers?.get === 'function'
      ? headers.get(name)
      : headers?.[name] || headers?.[name.toLowerCase()];

  // Only trust headers the hosting platform overwrites at the edge. A client can
  // freely send cf-connecting-ip / x-real-ip / x-forwarded-for, so trusting them
  // blindly (as this once did) lets an attacker pick a fresh rate-limit bucket per
  // request and bypass the AI spend limits entirely. On Vercel the edge sets
  // x-vercel-forwarded-for and x-real-ip to the real client address.
  const vercelForwarded = String(get('x-vercel-forwarded-for') || '')
    .split(',')[0]
    .trim();
  const realIp = String(get('x-real-ip') || '').trim();
  const forwarded = String(get('x-forwarded-for') || '')
    .split(',')[0]
    .trim();

  return (
    vercelForwarded ||
    realIp ||
    forwarded ||
    req?.socket?.remoteAddress ||
    'unknown'
  );
}
