import { contactMessageCreate } from "@portfolio/types";
import { handle, ok, badRequest, readJson } from "@/server/http";
import { parse } from "@/server/resources";
import { supabase } from "@/server/supabase";

export const runtime = "nodejs";

/** Public contact-form submission. Honeypot + best-effort persistence. */
export const POST = handle(async (req: Request) => {
  const body = parse(contactMessageCreate, await readJson(req)) as {
    name: string;
    email: string;
    subject: string;
    message: string;
    company?: string;
  };

  // Honeypot: bots fill the hidden `company` field.
  if (body.company) throw badRequest("Spam detected");

  const { error } = await supabase.from("contact_messages").insert({
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    user_agent: req.headers.get("user-agent") ?? null,
  });
  if (error) throw error;
  return ok({ ok: true }, 201);
});
