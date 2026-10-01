import "server-only";

import { cookies } from "next/headers";
import { authConfig } from "@/lib/config";
import type { SessionUser } from "@/types/auth";

interface TokenPayload {
  sub: number;
  user: string;
}

function isTokenPayload(value: unknown): value is TokenPayload {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as TokenPayload).sub === "number" &&
    typeof (value as TokenPayload).user === "string"
  );
}

/**
 * Reads the user from the Fake Store JWT. The API exposes no verification key, so the
 * token is only decoded — authorisation-sensitive calls must still go through the API.
 */
export function decodeToken(token: string): SessionUser | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const decoded: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return isTokenPayload(decoded) ? { id: decoded.sub, username: decoded.user } : null;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(authConfig.sessionCookie)?.value;
  return token ? decodeToken(token) : null;
}

export async function createSession(token: string): Promise<void> {
  (await cookies()).set(authConfig.sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: authConfig.sessionMaxAgeSeconds,
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(authConfig.sessionCookie);
}
