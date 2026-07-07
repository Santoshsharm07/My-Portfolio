import "server-only";
import type { ZodTypeAny } from "zod";
import {
  projectCreate,
  projectUpdate,
  skillCreate,
  skillUpdate,
  experienceCreate,
  experienceUpdate,
  certificationCreate,
  certificationUpdate,
  testimonialCreate,
  testimonialUpdate,
  freelanceServiceCreate,
  freelanceServiceUpdate,
  seoMetaUpsert,
  heroUpdate,
  aboutUpdate,
  siteSettingsUpdate,
} from "@portfolio/types";
import { supabase } from "./supabase";
import { revalidate } from "./revalidate";
import { badRequest, notFound } from "./http";

/** Validate a value against a Zod schema, throwing a 400 on failure. */
export function parse<T extends ZodTypeAny>(schema: T, body: unknown) {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw badRequest("Validation failed", result.error.flatten());
  }
  return result.data;
}

/* ── Collection resources (generic CRUD) ────────────────────────────────── */

export interface CollectionConfig {
  table: string;
  createSchema: ZodTypeAny;
  updateSchema: ZodTypeAny;
  orderBy: { column: string; ascending: boolean };
  tags: string[];
  reorderable: boolean;
}

const collection = (
  table: string,
  createSchema: ZodTypeAny,
  updateSchema: ZodTypeAny,
  tags: string[],
  opts: Partial<Pick<CollectionConfig, "orderBy" | "reorderable">> = {},
): CollectionConfig => ({
  table,
  createSchema,
  updateSchema,
  tags,
  orderBy: opts.orderBy ?? { column: "sort_order", ascending: true },
  reorderable: opts.reorderable ?? false,
});

export const collections: Record<string, CollectionConfig> = {
  projects: collection("projects", projectCreate, projectUpdate, ["projects", "home"], { reorderable: true }),
  skills: collection("skills", skillCreate, skillUpdate, ["skills", "home"], { reorderable: true }),
  experience: collection("experience", experienceCreate, experienceUpdate, ["experience", "home"], { reorderable: true }),
  certifications: collection("certifications", certificationCreate, certificationUpdate, ["certifications", "home"], { reorderable: true }),
  testimonials: collection("testimonials", testimonialCreate, testimonialUpdate, ["testimonials", "home"], { reorderable: true }),
  freelance: collection("freelance_services", freelanceServiceCreate, freelanceServiceUpdate, ["freelance", "home"], { reorderable: true }),
  seo: collection("seo_meta", seoMetaUpsert, seoMetaUpsert.partial(), ["seo"], {
    orderBy: { column: "page_key", ascending: true },
  }),
};

export async function listCollection(cfg: CollectionConfig) {
  const { data, error } = await supabase
    .from(cfg.table)
    .select("*")
    .order(cfg.orderBy.column, { ascending: cfg.orderBy.ascending });
  if (error) throw error;
  return data;
}

export async function getCollectionItem(cfg: CollectionConfig, id: string) {
  const { data, error } = await supabase
    .from(cfg.table)
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) throw notFound(cfg.table);
  return data;
}

export async function createCollectionItem(cfg: CollectionConfig, body: unknown) {
  const values = parse(cfg.createSchema, body);
  const { data, error } = await supabase
    .from(cfg.table)
    .insert(values)
    .select("*")
    .single();
  if (error) throw error;
  revalidate(cfg.tags);
  return data;
}

export async function updateCollectionItem(
  cfg: CollectionConfig,
  id: string,
  body: unknown,
) {
  const values = parse(cfg.updateSchema, body) as Record<string, unknown>;
  // An all-unknown/empty patch would issue a no-op UPDATE that returns no row;
  // treat it as "nothing to change" and return the current record instead.
  if (Object.keys(values).length === 0) {
    return getCollectionItem(cfg, id);
  }
  const { data, error } = await supabase
    .from(cfg.table)
    .update(values)
    .eq("id", id)
    .select("*")
    .single();
  if (error || !data) throw notFound(cfg.table);
  revalidate(cfg.tags);
  return data;
}

export async function deleteCollectionItem(cfg: CollectionConfig, id: string) {
  const { error } = await supabase.from(cfg.table).delete().eq("id", id);
  if (error) throw error;
  revalidate(cfg.tags);
}

export async function reorderCollection(
  cfg: CollectionConfig,
  items: { id: string; sort_order: number }[],
) {
  await Promise.all(
    items.map((it) =>
      supabase.from(cfg.table).update({ sort_order: it.sort_order }).eq("id", it.id),
    ),
  );
  revalidate(cfg.tags);
}

/* ── Singleton resources (one-row tables) ───────────────────────────────── */

export interface SingletonConfig {
  table: string;
  schema: ZodTypeAny;
}

export const singletons: Record<string, SingletonConfig> = {
  "site-settings": { table: "site_settings", schema: siteSettingsUpdate },
  hero: { table: "hero", schema: heroUpdate },
  about: { table: "about", schema: aboutUpdate },
};

export async function getSingleton(cfg: SingletonConfig) {
  const { data } = await supabase
    .from(cfg.table)
    .select("*")
    .limit(1)
    .maybeSingle();
  return data;
}

export async function putSingleton(cfg: SingletonConfig, body: unknown) {
  const values = parse(cfg.schema, body);
  const { data: existing } = await supabase
    .from(cfg.table)
    .select("id")
    .limit(1)
    .maybeSingle();

  const query = existing
    ? supabase.from(cfg.table).update(values).eq("id", existing.id)
    : supabase.from(cfg.table).insert(values);

  const { data, error } = await query.select("*").single();
  if (error) throw error;
  revalidate([cfg.table, "home"]);
  return data;
}
