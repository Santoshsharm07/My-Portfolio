"use client";

import { API_URL } from "./env";

const TOKEN_KEY = "portfolio_admin_token";

export const tokenStore = {
  get: () =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class AdminApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface Options {
  method?: string;
  body?: unknown;
  /** Send FormData instead of JSON (for uploads). */
  form?: FormData;
}

/** Authenticated client fetch to the Express API (Bearer token). */
export async function adminApi<T>(
  path: string,
  { method = "GET", body, form }: Options = {},
): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = {};
  if (token) headers.authorization = `Bearer ${token}`;
  if (!form) headers["content-type"] = "application/json";

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: form ?? (body ? JSON.stringify(body) : undefined),
  });

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = json?.error?.message ?? `Request failed (${res.status})`;
    throw new AdminApiError(res.status, message, json?.error?.details);
  }
  return (json.data ?? json) as T;
}
