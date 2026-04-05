/**
 * Edge-compatible auth helpers for middleware.
 * Cannot use next/headers cookies() — reads from NextRequest instead.
 */

import type { NextRequest } from "next/server";

const COOKIE_NAME = "rmb_session";

interface SessionUser {
  email: string;
  role: "admin" | "sme";
  name: string;
}

interface SessionPayload {
  user: SessionUser;
  exp: number;
}

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
}

function fromBase64Url(str: string): ArrayBuffer {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return bytes.buffer as ArrayBuffer;
}

/** Verify session cookie from a NextRequest. Returns user or null. */
export async function getSessionFromRequest(
  request: NextRequest
): Promise<SessionUser | null> {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) return null;

    const cookie = request.cookies.get(COOKIE_NAME);
    if (!cookie?.value) return null;

    const token = cookie.value;
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return null;

    const payloadEncoded = token.slice(0, lastDot);
    const sigStr = token.slice(lastDot + 1);

    const key = await getKey(secret);
    const enc = new TextEncoder();
    const sigBuf = fromBase64Url(sigStr);

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuf,
      enc.encode(payloadEncoded)
    );

    if (!valid) return null;

    const json = atob(payloadEncoded.replace(/-/g, "+").replace(/_/g, "/"));
    const payload: SessionPayload = JSON.parse(json);

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload.user;
  } catch {
    return null;
  }
}
