const DEFAULT_API_URL = "http://localhost:8000";

function normalizeBaseUrl(value?: string): string {
  const raw = (value || DEFAULT_API_URL).trim();
  return raw.replace(/\/+$/, "");
}

export const API_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

export const WS_BASE_URL = API_URL.replace(/^https:/, "wss:").replace(/^http:/, "ws:");
