const fallbackApiBaseUrl = "https://filonero.cenidev.com/api";

export const apiBaseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL ?? fallbackApiBaseUrl).replace(/\/+$/, "");

export function buildApiUrl(path: string): string {
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
