import { env } from "../config/env.js";
import { logger } from "./logger.js";

/**
 * Best-effort fire-and-forget call to the Next.js revalidation endpoint so the
 * public site refreshes after an admin write. Never throws into the request.
 */
export async function revalidate(tags: string[]): Promise<void> {
  if (!env.revalidateSecret) return;
  try {
    await fetch(`${env.siteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-revalidate-secret": env.revalidateSecret,
      },
      body: JSON.stringify({ tags }),
    });
  } catch (err) {
    logger.warn({ err }, "revalidate failed");
  }
}
