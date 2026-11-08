/**
 * Firebase ID-token verification and admin authorization for Cloudflare Pages
 * Functions. Mirrors lib/ai-auth.mjs but uses only Web APIs available in the
 * Workers runtime (no process/Buffer).
 */

const JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const CLOCK_SKEW_SECONDS = 60;
const DEFAULT_PROJECT_ID = 'revel-5818b';

export class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

function projectId(env) {
  return (env?.FIREBASE_PROJECT_ID || DEFAULT_PROJECT_ID).trim();
}

function base64UrlToBytes(value) {
  let normalized = String(value).replace(/-/g, '+').replace(/_/g, '/');
  while (normalized.length % 4 !== 0) normalized += '=';
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function decodeJsonSegment(segment) {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToBytes(segment)));
  } catch {
    throw new AuthError(401, 'Invalid authentication token.');
  }
}

let jwksCache = { keys: new Map(), expiresAt: 0 };
let jwksInFlight = null;

async function fetchJwks(force = false) {
  const now = Date.now();
  if (!force && jwksCache.keys.size > 0 && jwksCache.expiresAt > now) {
    return jwksCache.keys;
  }
  if (jwksInFlight) return jwksInFlight;

  jwksInFlight = (async () => {
    let response;
    try {
      response = await fetch(JWKS_URL, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(5000),
      });
    } catch {
      throw new AuthError(503, 'Authorization service is temporarily unavailable.');
    }
    if (!response.ok) {
      throw new AuthError(503, 'Authorization service is temporarily unavailable.');
    }

    const body = await response.json();
    const keys = new Map();
    for (const jwk of body.keys || []) {
      if (jwk && jwk.kid) keys.set(jwk.kid, jwk);
    }

    const maxAge = /max-age=(\d+)/i.exec(response.headers.get('cache-control') || '');
    const ttlSeconds = maxAge ? Math.min(Number(maxAge[1]) || 3600, 21600) : 3600;
    jwksCache = { keys, expiresAt: Date.now() + ttlSeconds * 1000 };
    return keys;
  })();

  try {
    return await jwksInFlight;
  } finally {
    jwksInFlight = null;
  }
}

async function importKey(jwk) {
  return crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify']
  );
}

export function getBearerToken(request) {
  const raw = request?.headers?.get?.('authorization');
  if (!raw) return null;
  const match = /^Bearer\s+(.+)$/i.exec(raw.trim());
  return match ? match[1].trim() : null;
}

export async function verifyFirebaseIdToken(token, env) {
  if (!token) throw new AuthError(401, 'Authentication required.');

  const parts = token.split('.');
  if (parts.length !== 3) throw new AuthError(401, 'Invalid authentication token.');

  const header = decodeJsonSegment(parts[0]);
  const claims = decodeJsonSegment(parts[1]);

  if (header.alg !== 'RS256' || !header.kid) {
    throw new AuthError(401, 'Invalid authentication token.');
  }

  const expectedProject = projectId(env);
  const now = Math.floor(Date.now() / 1000);

  if (typeof claims.exp !== 'number' || claims.exp < now - CLOCK_SKEW_SECONDS) {
    throw new AuthError(401, 'Authentication token has expired.');
  }
  if (typeof claims.iat === 'number' && claims.iat > now + CLOCK_SKEW_SECONDS) {
    throw new AuthError(401, 'Invalid authentication token.');
  }
  if (claims.aud !== expectedProject) {
    throw new AuthError(401, 'Invalid authentication token.');
  }
  if (claims.iss !== `https://securetoken.google.com/${expectedProject}`) {
    throw new AuthError(401, 'Invalid authentication token.');
  }
  if (typeof claims.sub !== 'string' || claims.sub.length === 0) {
    throw new AuthError(401, 'Invalid authentication token.');
  }

  let keys = await fetchJwks();
  let jwk = keys.get(header.kid);
  if (!jwk) {
    keys = await fetchJwks(true);
    jwk = keys.get(header.kid);
  }
  if (!jwk) throw new AuthError(401, 'Invalid authentication token.');

  let valid = false;
  try {
    const key = await importKey(jwk);
    valid = await crypto.subtle.verify(
      { name: 'RSASSA-PKCS1-v1_5' },
      key,
      base64UrlToBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    );
  } catch {
    valid = false;
  }

  if (!valid) throw new AuthError(401, 'Invalid authentication token.');
  return claims;
}

export async function requireAdmin(request, env) {
  const token = getBearerToken(request);
  if (!token) throw new AuthError(401, 'Authentication required.');

  const claims = await verifyFirebaseIdToken(token, env);
  const uid = claims.sub;

  const url =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId(env))}` +
    `/databases/(default)/documents/admins/${encodeURIComponent(uid)}`;

  let response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    throw new AuthError(503, 'Authorization service is temporarily unavailable.');
  }

  if (response.status === 404) throw new AuthError(403, 'Admin access required.');
  if (!response.ok) {
    throw new AuthError(503, 'Authorization service is temporarily unavailable.');
  }

  const document = await response.json();
  const fields = document?.fields || {};
  const role = fields.role?.stringValue;
  const active = fields.active?.booleanValue;

  if (role !== 'admin' || active !== true) {
    throw new AuthError(403, 'Admin access required.');
  }

  return { uid, email: claims.email || '' };
}
