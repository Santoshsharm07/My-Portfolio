import { API_URL } from "./env";

interface FetchOptions {
  /** Next.js cache tags for ISR revalidation. */
  tags?: string[];
  revalidate?: number | false;
  method?: string;
  body?: unknown;
  /** Forward the admin cookie for authenticated server calls. */
  cookie?: string;
}

/**
 * Server-side fetch helper for the Express API. Unwraps the `{ data }` envelope.
 */
export async function apiFetch<T>(
  path: string,
  opts: FetchOptions = {},
): Promise<T> {
  const { tags, revalidate, method = "GET", body, cookie } = opts;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    next: tags || revalidate !== undefined ? { tags, revalidate } : undefined,
    cache: revalidate === undefined && !tags ? "no-store" : undefined,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`API ${path} failed: ${res.status} ${detail}`);
  }
  const json = (await res.json()) as { data: T };
  return json.data;
}
