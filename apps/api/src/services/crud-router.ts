import { Router } from "express";
import type { ZodTypeAny } from "zod";
import { supabase } from "../lib/supabase.js";
import { revalidate } from "../lib/revalidate.js";
import { asyncHandler } from "../middleware/error.js";
import { validateBody } from "../middleware/validate.js";
import { reorderInput } from "@portfolio/types";
import { notFound } from "../lib/http-error.js";

interface CrudOptions {
  table: string;
  createSchema: ZodTypeAny;
  updateSchema: ZodTypeAny;
  /** Column + direction for list ordering. */
  orderBy?: { column: string; ascending?: boolean };
  /** Cache tags to revalidate on the web app after a write. */
  revalidateTags?: string[];
  /** Enable PATCH /reorder for drag-and-drop lists. */
  reorderable?: boolean;
}

/**
 * Builds a guarded admin CRUD router for a Supabase table.
 * Mount behind `requireAdmin`.
 */
export function crudRouter(opts: CrudOptions): Router {
  const {
    table,
    createSchema,
    updateSchema,
    orderBy = { column: "sort_order", ascending: true },
    revalidateTags = [table],
    reorderable = false,
  } = opts;

  const router = Router();

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .order(orderBy.column, { ascending: orderBy.ascending ?? true });
      if (error) throw error;
      res.json({ data });
    }),
  );

  // NOTE: register /reorder before /:id so "reorder" is not treated as an id.
  if (reorderable) {
    router.patch(
      "/reorder",
      validateBody(reorderInput),
      asyncHandler(async (req, res) => {
        const items = req.body.items as { id: string; sort_order: number }[];
        await Promise.all(
          items.map((it) =>
            supabase
              .from(table)
              .update({ sort_order: it.sort_order })
              .eq("id", it.id),
          ),
        );
        await revalidate(revalidateTags);
        res.json({ ok: true });
      }),
    );
  }

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", req.params.id)
        .single();
      if (error || !data) throw notFound(table);
      res.json({ data });
    }),
  );

  router.post(
    "/",
    validateBody(createSchema),
    asyncHandler(async (req, res) => {
      const { data, error } = await supabase
        .from(table)
        .insert(req.body)
        .select("*")
        .single();
      if (error) throw error;
      await revalidate(revalidateTags);
      res.status(201).json({ data });
    }),
  );

  router.patch(
    "/:id",
    validateBody(updateSchema),
    asyncHandler(async (req, res) => {
      const { data, error } = await supabase
        .from(table)
        .update(req.body)
        .eq("id", req.params.id)
        .select("*")
        .single();
      if (error || !data) throw notFound(table);
      await revalidate(revalidateTags);
      res.json({ data });
    }),
  );

  router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", req.params.id);
      if (error) throw error;
      await revalidate(revalidateTags);
      res.status(204).end();
    }),
  );

  return router;
}
