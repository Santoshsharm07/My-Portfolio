import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { asyncHandler } from "../middleware/error.js";
import { notFound } from "../lib/http-error.js";

/** Guarded contact-messages router (mounted under requireAdmin). */
export const messagesRouter: import("express").Router = Router();

messagesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ data });
  }),
);

messagesRouter.patch(
  "/:id/read",
  asyncHandler(async (req, res) => {
    const is_read = req.body?.is_read ?? true;
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read })
      .eq("id", req.params.id)
      .select("*")
      .single();
    if (error || !data) throw notFound("Message");
    res.json({ data });
  }),
);

messagesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.status(204).end();
  }),
);
