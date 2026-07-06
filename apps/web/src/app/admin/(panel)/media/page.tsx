"use client";

import { useEffect, useRef, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import type { Media } from "@portfolio/types";

export default function MediaAdmin() {
  const toast = useToast();
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      setItems(await adminApi<Media[]>("/media"));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to load", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const created = await adminApi<Media>("/media", {
          method: "POST",
          form: fd,
        });
        setItems((prev) => [created, ...prev]);
      }
      toast("Uploaded");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this file?")) return;
    try {
      await adminApi(`/media/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast("Deleted");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Media Library"
        description="Images and files used across your site."
        action={
          <label className="cursor-pointer rounded-full bg-accent-500 px-5 py-2.5 text-sm font-medium text-base-950 hover:bg-accent-400">
            {uploading ? "Uploading…" : "+ Upload"}
            <input
              ref={fileRef}
              type="file"
              multiple
              onChange={upload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        }
      />

      {loading ? (
        <p className="text-ink-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-base-800 px-4 py-16 text-center text-sm text-ink-500">
          No media yet — upload your first file.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => (
            <div
              key={m.id}
              className="group overflow-hidden rounded-xl border border-base-800 bg-base-900/40"
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden bg-base-950">
                {m.mime_type.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.public_url}
                    alt={m.alt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-ink-500">
                    {m.file_name.split(".").pop()?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-2.5">
                <span className="truncate text-xs text-ink-400" title={m.file_name}>
                  {m.file_name}
                </span>
                <button
                  onClick={() => remove(m.id)}
                  className="shrink-0 text-xs text-ink-600 hover:text-danger"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
