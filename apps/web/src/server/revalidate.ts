import "server-only";
import { revalidateTag } from "next/cache";

/**
 * Refresh cached public content after an admin write. Because the API now runs
 * inside Next.js, we can invalidate tags directly — no HTTP hop to a separate
 * revalidation endpoint.
 */
export function revalidate(tags: string[]): void {
  for (const tag of tags) {
    try {
      revalidateTag(tag);
    } catch {
      // revalidateTag can only run in a request/route scope; ignore otherwise.
    }
  }
}
