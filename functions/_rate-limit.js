/**
 * In-memory fixed-window rate limiter for Cloudflare Pages Functions.
 * Per-isolate only; a durable store is required for a strict global quota.
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

  return {
    allowed: bucket.count <= limit,
    limit,
    remaining: Math.max(0, limit - bucket.count),
    retryAfter: Math.max(1, Math.ceil((bucket.reset - now) / 1000)),
  };
}

export function clientKey(request) {
  const headers = request?.headers;
  return (
    headers?.get?.('cf-connecting-ip') ||
    headers?.get?.('x-real-ip') ||
    (headers?.get?.('x-forwarded-for') || '').split(',')[0].trim() ||
    'unknown'
  );
}
