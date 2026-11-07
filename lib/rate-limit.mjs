/**
 * Small in-memory fixed-window rate limiter for the AI endpoints.
 *
 * Serverless instances are not a shared store, so this is a cost-raising
 * safeguard, not a hard quota. Use a durable store (e.g. Redis/Upstash) when a
 * strict global limit is required.
 */

const buckets = new Map();
const MAX_BUCKETS = 10000;

function sweep(now) {
  if (buckets.size <= MAX_BUCKETS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.reset <= now) buckets.delete(key);
    if (buckets.size <= MAX_BUCKETS) break;
  }
}

export function rateLimit(key, { limit = 30, windowMs = 60_000 } = {}) {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || bucket.reset <= now) {
    bucket = { count: 0, reset: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  sweep(now);

  const allowed = bucket.count <= limit;
  return {
    allowed,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfter: Math.max(1, Math.ceil((bucket.reset - now) / 1000)),
  };
}

export function clientKey(req) {
  const headers = req?.headers;
  const get = (name) =>
    typeof headers?.get === 'function'
      ? headers.get(name)
      : headers?.[name] || headers?.[name.toLowerCase()];

  const forwarded = String(get('x-forwarded-for') || '')
    .split(',')[0]
    .trim();

  return (
    get('cf-connecting-ip') ||
    get('x-real-ip') ||
    forwarded ||
    req?.socket?.remoteAddress ||
    'unknown'
  );
}
