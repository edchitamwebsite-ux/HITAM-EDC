/**
 * EDC HITAM — Cryptographic Session & Security Utilities
 * Protects administrative routes and sensitive payloads against tampering.
 */

// Server-side administrative signing salt
const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || 'edc-hitam-sec-token-2026-auth-seal';

/**
 * Simple, portable cryptographic hash using Web Crypto API (supported across Edge, Node, Browser)
 */
async function createHash(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  
  // Use Web Crypto SubtleCrypto
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback djb2 hash if SubtleCrypto unavailable
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

/**
 * Creates a signed admin session payload
 * Format: `<email>.<timestamp>.<signature>`
 */
export async function createAdminSessionToken(email: string): Promise<string> {
  const timestamp = Date.now();
  const payload = `${email.toLowerCase().trim()}:${timestamp}`;
  const signature = await createHash(`${payload}:${ADMIN_SECRET}`);
  return `${btoa(payload)}.${signature}`;
}

/**
 * Verifies if an admin session token is valid and not expired (24-hour TTL)
 */
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !token.includes('.')) return false;

  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return false;

    const payload = atob(encodedPayload);
    const [email, timestampStr] = payload.split(':');
    const timestamp = parseInt(timestampStr, 10);

    // Check expiration: 24 hours (86,400,000 ms)
    if (isNaN(timestamp) || Date.now() - timestamp > 86400000) {
      return false;
    }

    // Check authorized admin emails
    const validEmails = ['edc.hitam.website@hitam.org', 'admin@hitam.org', 'edc@hitam.org'];
    if (!validEmails.includes(email.toLowerCase())) {
      return false;
    }

    // Verify cryptographic signature
    const expectedSignature = await createHash(`${payload}:${ADMIN_SECRET}`);
    return signature === expectedSignature;
  } catch {
    return false;
  }
}
