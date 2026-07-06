import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { asyncHandler } from "../middleware/error.js";
import { validateBody } from "../middleware/validate.js";
import { caseStudyUpsert } from "@portfolio/types";
import { revalidate } from "../lib/revalidate.js";
import { notFound } from "../lib/http-error.js";

/** Guarded case-studies router (one per project, upserted by project_id). */
export const caseStudiesRouter: import("express").Router = Router();

caseStudiesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabase.from("case_studies").select("*");
    if (error) throw error;
    res.json({ data });
  }),
);

caseStudiesRouter.get(
  "/by-project/:projectId",
  asyncHandler(async (req, res) => {
    const { data } = await supabase
      .from("case_studies")
      .select("*")
      .eq("project_id", req.params.projectId)
      .maybeSingle();
    res.json({ data });
  }),
);

/** Upsert on project_id (unique). */
caseStudiesRouter.put(
  "/",
  validateBody(caseStudyUpsert),
  asyncHandler(async (req, res) => {
    const { data, error } = await supabase
      .from("case_studies")
      .upsert(req.body, { onConflict: "project_id" })
      .select("*")
      .single();
    if (error) throw error;
    await revalidate(["projects", "case_studies"]);
    res.json({ data });
  }),
);

caseStudiesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = await supabase
      .from("case_studies")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    await revalidate(["projects", "case_studies"]);
    res.status(204).end();
  }),
);

// fallback for unknown id lookups keeps parity with other routers
caseStudiesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { data } = await supabase
      .from("case_studies")
      .select("*")
      .eq("id", req.params.id)
      .maybeSingle();
    if (!data) throw notFound("Case study");
    res.json({ data });
  }),
);
