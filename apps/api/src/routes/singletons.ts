import { Router } from "express";
import type { ZodTypeAny } from "zod";
import { supabase } from "../lib/supabase.js";
import { asyncHandler } from "../middleware/error.js";
import { validateBody } from "../middleware/validate.js";
import { revalidate } from "../lib/revalidate.js";
import { heroUpdate, aboutUpdate, siteSettingsUpdate } from "@portfolio/types";

/**
 * Router for a single-row table (hero, about, site_settings).
 * GET returns the row; PUT updates the existing row or inserts the first one.
 */
function singletonRouter(table: string, schema: ZodTypeAny): import("express").Router {
  const router = Router();

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const { data } = await supabase
        .from(table)
        .select("*")
        .limit(1)
        .maybeSingle();
      res.json({ data });
    }),
  );

  router.put(
    "/",
    validateBody(schema),
    asyncHandler(async (req, res) => {
      const { data: existing } = await supabase
        .from(table)
        .select("id")
        .limit(1)
        .maybeSingle();

      const query = existing
        ? supabase.from(table).update(req.body).eq("id", existing.id)
        : supabase.from(table).insert(req.body);

      const { data, error } = await query.select("*").single();
      if (error) throw error;
      await revalidate([table, "home"]);
      res.json({ data });
    }),
  );

  return router;
}

export const heroRouter: import("express").Router = singletonRouter("hero", heroUpdate);
export const aboutRouter: import("express").Router = singletonRouter("about", aboutUpdate);
export const siteSettingsRouter: import("express").Router = singletonRouter(
  "site_settings",
  siteSettingsUpdate,
);
