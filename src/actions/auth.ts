"use server";

import { redirect } from "next/navigation";
import { login } from "@/lib/api/auth";
import { isApiError } from "@/lib/api/errors";
import { createSession, decodeToken, deleteSession } from "@/lib/session";
import { safeRedirectPath } from "@/lib/utils";
import type { LoginCredentials, LoginFormState } from "@/types/auth";

function validate({ username, password }: LoginCredentials): LoginFormState | null {
  const fieldErrors: NonNullable<Extract<LoginFormState, { status: "error" }>["fieldErrors"]> = {};
  if (!username) fieldErrors.username = "Enter your username";
  if (!password) fieldErrors.password = "Enter your password";
  return Object.keys(fieldErrors).length
    ? { status: "error", message: "Please fill in both fields.", fieldErrors, values: { username } }
    : null;
}

export async function loginAction(_prev: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const credentials: LoginCredentials = {
    username: String(formData.get("username") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
  const redirectTo = safeRedirectPath(String(formData.get("redirectTo") ?? ""));

  const invalid = validate(credentials);
  if (invalid) return invalid;

  try {
    const { token } = await login(credentials);
    if (!decodeToken(token)) throw new Error("Malformed token received from API");
    await createSession(token);
  } catch (error) {
    const isBadCredentials = isApiError(error) && ["UNAUTHORIZED", "BAD_REQUEST"].includes(error.code);
    return {
      status: "error",
      message: isBadCredentials
        ? "That username and password combination didn't work."
        : isApiError(error)
          ? error.userMessage
          : "We couldn't sign you in right now. Please try again.",
      values: { username: credentials.username },
    };
  }

  redirect(redirectTo);
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/products");
}
