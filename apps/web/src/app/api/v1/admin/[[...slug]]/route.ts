import { reorderInput, caseStudyUpsert } from "@portfolio/types";
import { requireAdmin } from "@/server/auth";
import {
  ok,
  noContent,
  notFound,
  badRequest,
  handle,
  readJson,
} from "@/server/http";
import { supabase } from "@/server/supabase";
import { revalidate } from "@/server/revalidate";
import {
  uploadToStorage,
  removeFromStorage,
  fileFromForm,
} from "@/server/storage";
import {
  collections,
  singletons,
  parse,
  listCollection,
  getCollectionItem,
  createCollectionItem,
  updateCollectionItem,
  deleteCollectionItem,
  reorderCollection,
  getSingleton,
  putSingleton,
} from "@/server/resources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug?: string[] }> };
type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/** All admin routes are guarded then dispatched by resource + sub-path. */
async function dispatch(req: Request, ctx: Ctx, method: Method) {
  await requireAdmin(req);
  const { slug = [] } = await ctx.params;
  const [resource, a, b] = slug;
  if (!resource) throw notFound("Route");

  /* ── Generic collections ──────────────────────────────────────────── */
  const cfg = collections[resource];
  if (cfg) {
    if (!a) {
      if (method === "GET") return ok(await listCollection(cfg));
      if (method === "POST")
        return ok(await createCollectionItem(cfg, await readJson(req)), 201);
      throw notFound("Route");
    }
    if (a === "reorder") {
      if (method !== "PATCH" || !cfg.reorderable) throw notFound("Route");
      const body = parse(reorderInput, await readJson(req)) as {
        items: { id: string; sort_order: number }[];
      };
      await reorderCollection(cfg, body.items);
      return ok({ ok: true });
    }
    if (method === "GET") return ok(await getCollectionItem(cfg, a));
    if (method === "PATCH")
      return ok(await updateCollectionItem(cfg, a, await readJson(req)));
    if (method === "DELETE") {
      await deleteCollectionItem(cfg, a);
      return noContent();
    }
    throw notFound("Route");
  }

  /* ── Singletons ───────────────────────────────────────────────────── */
  const sc = singletons[resource];
  if (sc) {
    if (a) throw notFound("Route");
    if (method === "GET") return ok(await getSingleton(sc));
    if (method === "PUT") return ok(await putSingleton(sc, await readJson(req)));
    throw notFound("Route");
  }

  /* ── Case studies (upsert by project_id) ──────────────────────────── */
  if (resource === "case-studies") {
    if (!a) {
      if (method === "GET") {
        const { data, error } = await supabase.from("case_studies").select("*");
        if (error) throw error;
        return ok(data);
      }
      if (method === "PUT") {
        const values = parse(caseStudyUpsert, await readJson(req));
        const { data, error } = await supabase
          .from("case_studies")
          .upsert(values, { onConflict: "project_id" })
          .select("*")
          .single();
        if (error) throw error;
        revalidate(["projects", "case_studies"]);
        return ok(data);
      }
      throw notFound("Route");
    }
    if (a === "by-project" && b && method === "GET") {
      const { data } = await supabase
        .from("case_studies")
        .select("*")
        .eq("project_id", b)
        .maybeSingle();
      return ok(data);
    }
    if (method === "GET") {
      const { data } = await supabase
        .from("case_studies")
        .select("*")
        .eq("id", a)
        .maybeSingle();
      if (!data) throw notFound("Case study");
      return ok(data);
    }
    if (method === "DELETE") {
      const { error } = await supabase.from("case_studies").delete().eq("id", a);
      if (error) throw error;
      revalidate(["projects", "case_studies"]);
      return noContent();
    }
    throw notFound("Route");
  }

  /* ── Media library ────────────────────────────────────────────────── */
  if (resource === "media") {
    if (!a) {
      if (method === "GET") {
        const { data, error } = await supabase
          .from("media")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return ok(data);
      }
      if (method === "POST") {
        const form = await req.formData();
        const file = await fileFromForm(form, "file");
        if (!file) throw badRequest("No file provided (field name: file)");
        const folder = (form.get("folder") as string) || "uploads";
        const { storage_path, public_url } = await uploadToStorage(file, folder);
        const { data, error } = await supabase
          .from("media")
          .insert({
            file_name: file.originalname,
            storage_path,
            public_url,
            mime_type: file.mimetype,
            size_bytes: file.buffer.length,
            alt: (form.get("alt") as string) ?? "",
          })
          .select("*")
          .single();
        if (error) throw error;
        return ok(data, 201);
      }
      throw notFound("Route");
    }
    if (method === "PATCH") {
      const body = await readJson(req);
      const { data, error } = await supabase
        .from("media")
        .update({ alt: body.alt })
        .eq("id", a)
        .select("*")
        .single();
      if (error || !data) throw notFound("Media");
      return ok(data);
    }
    if (method === "DELETE") {
      const { data: row } = await supabase
        .from("media")
        .select("storage_path")
        .eq("id", a)
        .maybeSingle();
      if (row?.storage_path) await removeFromStorage(row.storage_path);
      const { error } = await supabase.from("media").delete().eq("id", a);
      if (error) throw error;
      return noContent();
    }
    throw notFound("Route");
  }

  /* ── Résumé ───────────────────────────────────────────────────────── */
  if (resource === "resume") {
    if (!a) {
      if (method === "GET") {
        const { data, error } = await supabase
          .from("resume")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return ok(data);
      }
      if (method === "POST") {
        const form = await req.formData();
        const file = await fileFromForm(form, "file");
        if (!file) throw badRequest("No file provided (field name: file)");
        const { storage_path, public_url } = await uploadToStorage(file, "resume");

        const { data: media, error: mediaErr } = await supabase
          .from("media")
          .insert({
            file_name: file.originalname,
            storage_path,
            public_url,
            mime_type: file.mimetype,
            size_bytes: file.buffer.length,
          })
          .select("*")
          .single();
        if (mediaErr) throw mediaErr;

        await supabase
          .from("resume")
          .update({ is_active: false })
          .eq("is_active", true);
        const { data, error } = await supabase
          .from("resume")
          .insert({
            label: (form.get("label") as string) || file.originalname,
            file_media_id: media.id,
            version: (form.get("version") as string) || "1",
            is_active: true,
          })
          .select("*")
          .single();
        if (error) throw error;
        revalidate(["resume"]);
        return ok({ resume: data, media }, 201);
      }
      throw notFound("Route");
    }
    if (b === "activate" && method === "PATCH") {
      await supabase
        .from("resume")
        .update({ is_active: false })
        .eq("is_active", true);
      const { data, error } = await supabase
        .from("resume")
        .update({ is_active: true })
        .eq("id", a)
        .select("*")
        .single();
      if (error) throw error;
      revalidate(["resume"]);
      return ok(data);
    }
    if (method === "DELETE") {
      const { error } = await supabase.from("resume").delete().eq("id", a);
      if (error) throw error;
      revalidate(["resume"]);
      return noContent();
    }
    throw notFound("Route");
  }

  /* ── Contact messages ─────────────────────────────────────────────── */
  if (resource === "messages") {
    if (!a) {
      if (method === "GET") {
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return ok(data);
      }
      throw notFound("Route");
    }
    if (b === "read" && method === "PATCH") {
      const body = await readJson(req);
      const { data, error } = await supabase
        .from("contact_messages")
        .update({ is_read: body.is_read ?? true })
        .eq("id", a)
        .select("*")
        .single();
      if (error || !data) throw notFound("Message");
      return ok(data);
    }
    if (method === "DELETE") {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", a);
      if (error) throw error;
      return noContent();
    }
    throw notFound("Route");
  }

  throw notFound("Route");
}

export const GET = handle((req: Request, ctx: Ctx) => dispatch(req, ctx, "GET"));
export const POST = handle((req: Request, ctx: Ctx) => dispatch(req, ctx, "POST"));
export const PATCH = handle((req: Request, ctx: Ctx) => dispatch(req, ctx, "PATCH"));
export const PUT = handle((req: Request, ctx: Ctx) => dispatch(req, ctx, "PUT"));
export const DELETE = handle((req: Request, ctx: Ctx) => dispatch(req, ctx, "DELETE"));
