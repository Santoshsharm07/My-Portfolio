import { API_URL } from "./env";

interface FetchOptions {
  /** Next.js cache tags for ISR revalidation. */
  tags?: string[];
  revalidate?: number | false;
  method?: string;
  body?: unknown;
  /** Forward the admin cookie for authenticated server calls. */
  cookie?: string;
  /** Timeout in ms before aborting the request (default: 10000). */
  timeout?: number;
}

/**
 * Server-side fetch helper for the Express API. Unwraps the `{ data }` envelope.
 * Includes a default 10s timeout so build-time fetches to an unreachable API
 * fail fast instead of hanging until Vercel's 60s build timeout.
 */
export async function apiFetch<T>(
  path: string,
  opts: FetchOptions = {},
): Promise<T> {
  const { tags, revalidate, method = "GET", body, cookie, timeout = 10_000 } = opts;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const res = await fetch(`${API_URL}${path}`, {
    method,
    signal: controller.signal,
    headers: {
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    next: tags || revalidate !== undefined ? { tags, revalidate } : undefined,
    cache: revalidate === undefined && !tags ? "no-store" : undefined,
  }).finally(() => clearTimeout(timer));

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${detail}`);
  }
  const json = (await res.json()) as { data: T };
  return json.data;
}
