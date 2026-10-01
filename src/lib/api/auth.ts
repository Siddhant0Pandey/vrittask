import "server-only";

import type { LoginCredentials, LoginResponse } from "@/types/auth";
import { fakeStore } from "./fakestore";

export function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return fakeStore.post<LoginResponse>("/auth/login", credentials, { cache: "no-store" });
}
