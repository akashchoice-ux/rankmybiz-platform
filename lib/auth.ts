/**
 * RankMyBiz — Simple Auth System
 *
 * Temporary auth using env var credentials + signed cookies.
 * Designed to be replaced by Supabase Auth in Phase 3.
 *
 * Users:
 *   - Admin: ADMIN_EMAIL + ADMIN_PASSWORD env vars
 *   - SME: (future — Supabase signup)
 *
 * Session:
 *   - httpOnly cookie "rmb_session" containing a signed JSON payload
 *   - Signed with AUTH_SECRET env var using HMAC-SHA256
 *   - 7-day expiry
 */

import { cookies } from "next/headers";

const COOKIE_NAME = "rmb_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export type UserRole = "admin" | "sme";

export interface SessionUser {
  email: string;
  role: UserRole;
  name: string;
}

interface SessionPayload {
  user: SessionUser;
  exp: number; // Unix timestamp
}

// ─── Crypto helpers (Edge-compatible, no external deps) ─────────────────────

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET env var is required");
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(buf: ArrayBuffer): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(str: string): ArrayBuffer {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const buf = Buffer.from(padded, "base64");
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

async function sign(payload: string): Promise<string> {
  const key = await getKey();
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return `${payload}.${toBase64Url(sig)}`;
}

async function verify(token: string): Promise<string | null> {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload = token.slice(0, lastDot);
  const sigStr = token.slice(lastDot + 1);

  const key = await getKey();
  const enc = new TextEncoder();
  const sigBuf = fromBase64Url(sigStr);

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    sigBuf,
    enc.encode(payload)
  );

  return valid ? payload : null;
}

// ─── Session management ────────────────────────────────────────────────────

/** Create a signed session cookie. Call from API route after successful login. */
export async function createSession(user: SessionUser): Promise<string> {
  const payload: SessionPayload = {
    user,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE,
  };
  const json = JSON.stringify(payload);
  const encoded = Buffer.from(json).toString("base64url");
  return sign(encoded);
}

/** Read and validate the session from cookies. Returns null if invalid/expired. */
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie?.value) return null;

    const verified = await verify(cookie.value);
    if (!verified) return null;

    const json = Buffer.from(verified, "base64url").toString("utf8");
    const payload: SessionPayload = JSON.parse(json);

    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload.user;
  } catch {
    return null;
  }
}

/** Validate login credentials against env vars. Returns user if valid. */
export function validateCredentials(
  email: string,
  password: string
): SessionUser | null {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) return null;

  if (
    email.toLowerCase() === adminEmail.toLowerCase() &&
    password === adminPassword
  ) {
    return {
      email: adminEmail,
      role: "admin",
      name: "Admin",
    };
  }

  return null;
}

/** Cookie name and max age — exported for use in API routes. */
export { COOKIE_NAME, SESSION_MAX_AGE };
