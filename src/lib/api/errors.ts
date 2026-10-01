export type ApiErrorCode =
  | "NETWORK"
  | "TIMEOUT"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVER"
  | "EMPTY_RESPONSE"
  | "PARSE"
  | "UNKNOWN";

const USER_MESSAGES: Record<ApiErrorCode, string> = {
  NETWORK: "We couldn't reach the store. Check your connection and try again.",
  TIMEOUT: "The store is taking too long to respond. Please try again in a moment.",
  BAD_REQUEST: "Something about that request wasn't right. Please check and try again.",
  UNAUTHORIZED: "You need to be signed in to do that.",
  FORBIDDEN: "The store's data provider refused the request. Please try again shortly.",
  NOT_FOUND: "We couldn't find what you were looking for.",
  RATE_LIMITED: "You're going a little fast. Please wait a moment and try again.",
  SERVER: "The store is having trouble right now. Please try again shortly.",
  EMPTY_RESPONSE: "We couldn't find what you were looking for.",
  PARSE: "We received an unexpected response from the store.",
  UNKNOWN: "Something unexpected happened. Please try again.",
};

interface ApiErrorOptions {
  code: ApiErrorCode;
  status?: number;
  url?: string;
  details?: string;
  cause?: unknown;
}

/** Normalised error thrown by the API client for every failure mode. */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | undefined;
  readonly url: string | undefined;
  readonly details: string | undefined;

  constructor({ code, status, url, details, cause }: ApiErrorOptions) {
    super(details ?? USER_MESSAGES[code], { cause });
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.url = url;
    this.details = details;
  }

  /** A message that is safe and helpful to show to end users. */
  get userMessage(): string {
    return USER_MESSAGES[this.code];
  }

  get isNotFound(): boolean {
    return this.code === "NOT_FOUND" || this.code === "EMPTY_RESPONSE";
  }

  get isRetryable(): boolean {
    return ["NETWORK", "TIMEOUT", "SERVER", "RATE_LIMITED"].includes(this.code);
  }

  /**
   * The upstream service could not be used at all (unreachable, failing, or blocking us,
   * e.g. a bot-protection 403 on serverless hosts) — as opposed to rejecting the request itself.
   */
  get isUnavailable(): boolean {
    return ["NETWORK", "TIMEOUT", "SERVER", "RATE_LIMITED", "FORBIDDEN", "PARSE"].includes(this.code);
  }
}

export function codeFromStatus(status: number): ApiErrorCode {
  if (status === 400 || status === 422) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 429) return "RATE_LIMITED";
  if (status >= 500) return "SERVER";
  return "UNKNOWN";
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Resolves any thrown value to a user-facing message. */
export function getUserMessage(error: unknown): string {
  return isApiError(error) ? error.userMessage : USER_MESSAGES.UNKNOWN;
}
