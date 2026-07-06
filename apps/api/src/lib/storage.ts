import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import { supabase } from "./supabase.js";
import { env } from "../config/env.js";

export interface UploadResult {
  storage_path: string;
  public_url: string;
}

/** Uploads a buffer to Supabase Storage and returns its public URL. */
export async function uploadToStorage(
  file: { buffer: Buffer; mimetype: string; originalname: string },
  folder = "uploads",
): Promise<UploadResult> {
  const ext = extname(file.originalname) || "";
  const storage_path = `${folder}/${randomUUID()}${ext}`;

  const { error } = await supabase.storage
    .from(env.storageBucket)
    .upload(storage_path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (error) throw error;

  const { data } = supabase.storage
    .from(env.storageBucket)
    .getPublicUrl(storage_path);

  return { storage_path, public_url: data.publicUrl };
}

export async function removeFromStorage(storage_path: string): Promise<void> {
  await supabase.storage.from(env.storageBucket).remove([storage_path]);
}
