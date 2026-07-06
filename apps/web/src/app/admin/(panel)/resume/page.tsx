"use client";

import { useEffect, useRef, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "@/components/admin/AdminShell";
import { useToast } from "@/components/admin/Toast";
import type { Resume } from "@portfolio/types";

export default function ResumeAdmin() {
  const toast = useToast();
  const [items, setItems] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      setItems(await adminApi<Resume[]>("/resume"));
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
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("label", file.name);
      await adminApi("/resume", { method: "POST", form: fd });
      toast("Résumé uploaded & activated");
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function activate(id: string) {
    try {
      await adminApi(`/resume/${id}/activate`, { method: "PATCH" });
      toast("Activated");
      await load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this résumé?")) return;
    try {
      await adminApi(`/resume/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((x) => x.id !== id));
      toast("Deleted");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title="Résumé"
        description="Upload a PDF; the active one is offered for download on the site."
        action={
          <label className="cursor-pointer rounded-full bg-accent-500 px-5 py-2.5 text-sm font-medium text-base-950 hover:bg-accent-400">
            {uploading ? "Uploading…" : "+ Upload PDF"}
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
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
          No résumé uploaded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-xl border border-base-800 bg-base-900/40 px-5 py-4"
            >
              <div>
                <div className="text-sm text-ink-100">{r.label}</div>
                <div className="text-xs text-ink-500">v{r.version}</div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {r.is_active ? (
                  <span className="rounded-full bg-accent-500/20 px-3 py-1 text-accent-300">
                    Active
                  </span>
                ) : (
                  <button
                    onClick={() => activate(r.id)}
                    className="rounded-full border border-base-700 px-3 py-1 text-ink-300 hover:border-accent-500/60"
                  >
                    Make active
                  </button>
                )}
                <button
                  onClick={() => remove(r.id)}
                  className="text-ink-500 hover:text-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
