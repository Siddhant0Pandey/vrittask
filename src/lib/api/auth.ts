import "server-only";

import type { LoginCredentials, LoginResponse } from "@/types/auth";
import { ApiError, isApiError } from "./errors";
import { fakeStore } from "./fakestore";
import { snapshot } from "./snapshot";

const base64Url = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");

/**
 * Builds an unsigned token with the same payload shape as Fake Store's (`sub`, `user`).
 * Fake Store tokens are never verified by this app either, as the API exposes no key.
 */
function createSnapshotToken(user: { id: number; username: string }): string {
  const header = base64Url({ alg: "none", typ: "JWT" });
  const payload = base64Url({ sub: user.id, user: user.username, iat: Math.floor(Date.now() / 1000) });
  return `${header}.${payload}.`;
}

/**
 * Logs in through the Fake Store API. If the API is unavailable (e.g. blocked by bot
 * protection on serverless hosts), the credentials are checked against its public demo users.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    return await fakeStore.post<LoginResponse>("/auth/login", credentials, { cache: "no-store" });
  } catch (error) {
    if (!isApiError(error) || !error.isUnavailable) throw error;

    console.warn(`[api] login API unavailable (${error.code}), checking snapshot users`);
    const user = snapshot.findUser(credentials.username, credentials.password);
    if (!user) throw new ApiError({ code: "UNAUTHORIZED", status: 401, details: "Invalid credentials (snapshot)" });
    return { token: createSnapshotToken(user) };
  }
}
