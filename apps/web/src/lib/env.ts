/**
 * Base path of the API. Defaults to the same-origin `/api/v1` routes that now
 * live inside this Next.js app, so the admin panel and contact form work
 * identically on localhost and on Vercel with no extra configuration.
 *
 * Can still be overridden with an absolute URL (e.g. a standalone API host)
 * via NEXT_PUBLIC_API_URL.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? "";
