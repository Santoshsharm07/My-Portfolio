import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { Resume } from "@portfolio/types";

export const dynamic = "force-dynamic";

/**
 * Resolves the active résumé file via the public API and redirects to its
 * public URL. Falls back to the contact section if none is set.
 */
export default async function ResumePage() {
  const data = await apiFetch<{ resume: Resume | null; file_url: string | null }>(
    "/resume/active",
  ).catch(() => null);

  if (data?.file_url) redirect(data.file_url);
  redirect("/#contact");
}
