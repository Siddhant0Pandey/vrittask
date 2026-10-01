import "server-only";

import { apiConfig } from "@/lib/config";
import { createApiClient } from "./client";

/** Shared Fake Store API client. Server-only so the API is never called from the browser. */
export const fakeStore = createApiClient({
  baseUrl: apiConfig.baseUrl,
  timeoutMs: apiConfig.timeoutMs,
});

fakeStore.interceptors.error((error, { url, init }) => {
  // Single place to plug in error reporting (Sentry, Datadog, ...).
  console.error(`[api] ${init.method} ${url} failed: ${error.code}${error.status ? ` (${error.status})` : ""}`);
});

if (process.env.NODE_ENV === "development") {
  fakeStore.interceptors.request((context) => {
    console.info(`[api] → ${context.init.method} ${context.url}`);
    return context;
  });
}
