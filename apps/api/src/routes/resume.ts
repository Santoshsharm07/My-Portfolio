import { Router } from "express";
import multer from "multer";
import { supabase } from "../lib/supabase.js";
import { uploadToStorage } from "../lib/storage.js";
import { asyncHandler } from "../middleware/error.js";
import { revalidate } from "../lib/revalidate.js";
import { badRequest } from "../lib/http-error.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

/** Guarded resume router (mounted under requireAdmin). */
export const resumeRouter: import("express").Router = Router();

resumeRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabase
      .from("resume")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ data });
  }),
);

/** Upload a new resume PDF; creates a media row + resume row and activates it. */
resumeRouter.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw badRequest("No file provided (field name: file)");
    const { storage_path, public_url } = await uploadToStorage(
      req.file,
      "resume",
    );

    const { data: media, error: mediaErr } = await supabase
      .from("media")
      .insert({
        file_name: req.file.originalname,
        storage_path,
        public_url,
        mime_type: req.file.mimetype,
        size_bytes: req.file.size,
      })
      .select("*")
      .single();
    if (mediaErr) throw mediaErr;

    // Deactivate current, then insert new active resume.
    await supabase.from("resume").update({ is_active: false }).eq("is_active", true);
    const { data, error } = await supabase
      .from("resume")
      .insert({
        label: (req.body?.label as string) || req.file.originalname,
        file_media_id: media.id,
        version: (req.body?.version as string) || "1",
        is_active: true,
      })
      .select("*")
      .single();
    if (error) throw error;

    await revalidate(["resume"]);
    res.status(201).json({ data: { resume: data, media } });
  }),
);

resumeRouter.patch(
  "/:id/activate",
  asyncHandler(async (req, res) => {
    await supabase.from("resume").update({ is_active: false }).eq("is_active", true);
    const { data, error } = await supabase
      .from("resume")
      .update({ is_active: true })
      .eq("id", req.params.id)
      .select("*")
      .single();
    if (error) throw error;
    await revalidate(["resume"]);
    res.json({ data });
  }),
);

resumeRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { error } = await supabase
      .from("resume")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.status(204).end();
  }),
);
