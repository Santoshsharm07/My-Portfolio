import "server-only";
import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import { supabase } from "./supabase";
import { serverEnv } from "./env";

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
    .from(serverEnv.storageBucket)
    .upload(storage_path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  if (error) throw error;

  const { data } = supabase.storage
    .from(serverEnv.storageBucket)
    .getPublicUrl(storage_path);

  return { storage_path, public_url: data.publicUrl };
}

export async function removeFromStorage(storage_path: string): Promise<void> {
  await supabase.storage.from(serverEnv.storageBucket).remove([storage_path]);
}

/** Extract an uploaded file from a multipart request as an upload-ready object. */
export async function fileFromForm(
  form: FormData,
  field = "file",
): Promise<{ buffer: Buffer; mimetype: string; originalname: string } | null> {
  const entry = form.get(field);
  if (!entry || typeof entry === "string") return null;
  const file = entry as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    buffer,
    mimetype: file.type || "application/octet-stream",
    originalname: file.name || "upload",
  };
}
