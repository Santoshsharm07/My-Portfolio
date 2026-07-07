import { redirect } from "next/navigation";
import { getActiveResume } from "@/server/content";

export const dynamic = "force-dynamic";

/**
 * Resolves the active résumé file directly from the DB and redirects to its
 * public URL. Falls back to the contact section if none is set.
 */
export default async function ResumePage() {
  const data = await getActiveResume().catch(() => null);

  if (data?.file_url) redirect(data.file_url);
  redirect("/#contact");
}
