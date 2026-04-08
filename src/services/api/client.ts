import { buildApiUrl } from "@/src/config/api";
import type { ApiErrorPayload } from "@/src/types/domain";

export class ApiClientError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(params: { statusCode: number; code: string; message: string; details?: unknown }) {
    super(params.message);
    this.name = "ApiClientError";
    this.statusCode = params.statusCode;
    this.code = params.code;
    this.details = params.details;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  token?: string | null;
  body?: unknown;
};

async function parseJsonResponse<T>(response: Response): Promise<T | null> {
  const raw = await response.text();
  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json"
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(buildApiUrl(path), {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const payload = await parseJsonResponse<ApiErrorPayload>(response);
    throw new ApiClientError({
      statusCode: response.status,
      code: payload?.error?.code ?? "HTTP_ERROR",
      message: payload?.error?.message ?? `Request failed with status ${response.status}`,
      details: payload?.error?.details
    });
  }

  const payload = await parseJsonResponse<T>(response);
  return (payload ?? ({} as T)) as T;
}
