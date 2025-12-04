const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

type Method = "GET" | "POST" | "PUT" | "DELETE";

export class HttpError extends Error {
  status: number;
  payload: unknown;
  constructor(status: number, payload: unknown) {
    super(`HTTP ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

type RequestOptions = {
  method?: Method;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
};

export async function request<T = any>(path: string, opts: RequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new Error("VITE_API_URL no configurado");
  }

  const { method = "GET", body, token, headers = {} } = opts;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let payload: unknown;
    try { payload = await res.json(); } catch { payload = await res.text(); }
    throw new HttpError(res.status, payload);
  }

  if (res.status === 204) return null as T;
  try {
    return (await res.json()) as T;
  } catch {
    return null as T;
  }
}

export function buildUrl(path: string) {
  if (!API_URL) throw new Error("VITE_API_URL no configurado");
  return `${API_URL}${path}`;
}
