import { Router } from "express";
import multer from "multer";
import { supabase } from "../lib/supabase.js";
import { uploadToStorage, removeFromStorage } from "../lib/storage.js";
import { asyncHandler } from "../middleware/error.js";
import { badRequest, notFound } from "../lib/http-error.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

/** Guarded media library router (mounted under requireAdmin). */
export const mediaRouter: import("express").Router = Router();

mediaRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ data });
  }),
);

mediaRouter.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw badRequest("No file provided (field name: file)");
    const folder = (req.body?.folder as string) || "uploads";
    const { storage_path, public_url } = await uploadToStorage(req.file, folder);

    const { data, error } = await supabase
      .from("media")
      .insert({
        file_name: req.file.originalname,
        storage_path,
        public_url,
        mime_type: req.file.mimetype,
        size_bytes: req.file.size,
        alt: (req.body?.alt as string) ?? "",
      })
      .select("*")
      .single();
    if (error) throw error;
    res.status(201).json({ data });
  }),
);

mediaRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { data, error } = await supabase
      .from("media")
      .update({ alt: req.body?.alt })
      .eq("id", req.params.id)
      .select("*")
      .single();
    if (error || !data) throw notFound("Media");
    res.json({ data });
  }),
);

mediaRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { data: row } = await supabase
      .from("media")
      .select("storage_path")
      .eq("id", req.params.id)
      .maybeSingle();
    if (row?.storage_path) await removeFromStorage(row.storage_path);
    const { error } = await supabase
      .from("media")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.status(204).end();
  }),
);
