/**
 * Fixed-window rate limiter for Cloudflare Pages Functions.
 *
 * When UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL /
 * KV_REST_API_TOKEN) are bound to the Pages project, counters live in Redis so
 * the limit is shared across isolates. Otherwise it falls back to a bounded
 * per-isolate in-memory window.
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

export async function rateLimit(key, { limit = 30, windowMs = 60_000 } = {}, env = {}) {
  const config = redisConfig(env);
  if (!config) return memoryRateLimit(key, { limit, windowMs });

  try {
    return await redisRateLimit(config, key, { limit, windowMs });
  } catch (err) {
    console.error('[rate-limit] durable store unavailable, using in-memory fallback:', err?.message || err);
    return memoryRateLimit(key, { limit, windowMs });
  }
}

export function clientKey(request) {
  const headers = request?.headers;
  // Cloudflare overwrites cf-connecting-ip for every request; x-real-ip and
  // x-forwarded-for are client-supplied (Cloudflare appends to XFF, so its first
  // entry is attacker-controlled). Trust only the platform header.
  return headers?.get?.('cf-connecting-ip') || 'unknown';
}
