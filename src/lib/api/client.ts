import { ApiError, codeFromStatus } from "./errors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions extends Omit<RequestInit, "body" | "method"> {
  method?: HttpMethod;
  /** Serialised as JSON. */
  body?: unknown;
  query?: Record<string, QueryValue>;
  timeoutMs?: number;
  /** Next.js data cache options (ignored outside the Next.js server runtime). */
  next?: { revalidate?: number | false; tags?: string[] };
}

/** The fully-resolved request that interceptors can inspect and modify. */
export interface RequestContext {
  url: string;
  init: RequestInit & { next?: RequestOptions["next"] };
}

export type RequestInterceptor = (context: RequestContext) => RequestContext | Promise<RequestContext>;
export type ResponseInterceptor = (response: Response, context: RequestContext) => Response | Promise<Response>;
export type ErrorInterceptor = (error: ApiError, context: RequestContext) => void | Promise<void>;

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs?: number;
  defaultHeaders?: HeadersInit;
}

export interface ApiClient {
  request<T>(path: string, options?: RequestOptions): Promise<T>;
  get<T>(path: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T>;
  post<T>(path: string, body: unknown, options?: Omit<RequestOptions, "method" | "body">): Promise<T>;
  interceptors: {
    request: (interceptor: RequestInterceptor) => () => void;
    response: (interceptor: ResponseInterceptor) => () => void;
    error: (interceptor: ErrorInterceptor) => () => void;
  };
}

function buildUrl(baseUrl: string, path: string, query?: RequestOptions["query"]): string {
  const url = new URL(path.replace(/^\//, ""), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  });
  return url.toString();
}

/** Registers an interceptor and returns a function that unregisters it. */
function register<T>(list: T[], item: T): () => void {
  list.push(item);
  return () => {
    const index = list.indexOf(item);
    if (index !== -1) list.splice(index, 1);
  };
}

async function readErrorDetails(response: Response): Promise<string | undefined> {
  try {
    const text = await response.text();
    if (!text) return undefined;
    try {
      const parsed: unknown = JSON.parse(text);
      if (parsed && typeof parsed === "object" && "message" in parsed) return String(parsed.message);
    } catch {
      // Not JSON — fall through to the raw text.
    }
    return text.slice(0, 200);
  } catch {
    return undefined;
  }
}

function toApiError(error: unknown, url: string, timedOut: boolean): ApiError {
  if (error instanceof ApiError) return error;
  if (timedOut) return new ApiError({ code: "TIMEOUT", url, cause: error });
  if (error instanceof DOMException && error.name === "AbortError") {
    return new ApiError({ code: "NETWORK", url, details: "Request was aborted", cause: error });
  }
  return new ApiError({ code: "NETWORK", url, cause: error });
}

/**
 * Creates a typed wrapper around native `fetch` with interceptors, timeouts and
 * consistent error normalisation. Every failure surfaces as an `ApiError`.
 */
export function createApiClient({ baseUrl, timeoutMs = 10_000, defaultHeaders }: ApiClientConfig): ApiClient {
  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: ResponseInterceptor[] = [];
  const errorInterceptors: ErrorInterceptor[] = [];

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, query, timeoutMs: requestTimeout = timeoutMs, headers, signal, ...rest } = options;

    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, requestTimeout);
    signal?.addEventListener("abort", () => controller.abort(), { once: true });

    let context: RequestContext = {
      url: buildUrl(baseUrl, path, query),
      init: {
        ...rest,
        method: options.method ?? "GET",
        headers: {
          Accept: "application/json",
          ...(body !== undefined && { "Content-Type": "application/json" }),
          ...defaultHeaders,
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      },
    };

    try {
      for (const interceptor of requestInterceptors) context = await interceptor(context);

      let response = await fetch(context.url, context.init);
      for (const interceptor of responseInterceptors) response = await interceptor(response, context);

      if (!response.ok) {
        throw new ApiError({
          code: codeFromStatus(response.status),
          status: response.status,
          url: context.url,
          details: await readErrorDetails(response),
        });
      }

      const text = await response.text();
      if (!text.trim()) {
        throw new ApiError({ code: "EMPTY_RESPONSE", status: response.status, url: context.url });
      }

      try {
        return JSON.parse(text) as T;
      } catch (cause) {
        throw new ApiError({ code: "PARSE", status: response.status, url: context.url, cause });
      }
    } catch (error) {
      const apiError = toApiError(error, context.url, timedOut);
      for (const interceptor of errorInterceptors) await interceptor(apiError, context);
      throw apiError;
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) => request(path, { ...options, method: "POST", body }),
    interceptors: {
      request: (interceptor) => register(requestInterceptors, interceptor),
      response: (interceptor) => register(responseInterceptors, interceptor),
      error: (interceptor) => register(errorInterceptors, interceptor),
    },
  };
}
