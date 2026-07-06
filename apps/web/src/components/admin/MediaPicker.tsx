"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import type { Media } from "@portfolio/types";

/** Selects an existing media item (or uploads a new one) and returns its id. */
export function MediaPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const selected = items.find((m) => m.id === value) ?? null;

  async function load() {
    setLoading(true);
    try {
      setItems(await adminApi<Media[]>("/media"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open && items.length === 0) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    // Resolve preview for an already-set value.
    if (value && items.length === 0) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const created = await adminApi<Media>("/media", { method: "POST", form: fd });
    setItems((prev) => [created, ...prev]);
    onChange(created.id);
    setOpen(false);
  }

  return (
    <div>
      <div className="flex items-center gap-3 rounded-lg border border-base-700 bg-base-950 p-2.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-base-700 bg-base-900 text-ink-600">
          {selected?.mime_type?.startsWith("image/") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.public_url}
              alt={selected.alt}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs">{selected ? "FILE" : "—"}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm text-ink-200">
            {selected?.file_name ?? "No file selected"}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border border-base-700 px-3 py-1.5 text-xs text-ink-300 hover:border-accent-500/60"
        >
          Choose
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-md px-2 py-1.5 text-xs text-ink-500 hover:text-danger"
          >
            Clear
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-base-950/80 p-6 backdrop-blur"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-base-800 bg-base-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg text-ink-50">Media library</h3>
              <label className="cursor-pointer rounded-lg bg-accent-500 px-4 py-2 text-xs font-medium text-base-950 hover:bg-accent-400">
                Upload
                <input type="file" onChange={upload} className="hidden" />
              </label>
            </div>
            {loading ? (
              <p className="py-10 text-center text-ink-500">Loading…</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {items.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onChange(m.id);
                      setOpen(false);
                    }}
                    className="group aspect-square overflow-hidden rounded-lg border border-base-700 bg-base-950 hover:border-accent-500"
                  >
                    {m.mime_type.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.public_url}
                        alt={m.alt}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center text-xs text-ink-500">
                        {m.file_name.split(".").pop()?.toUpperCase()}
                      </span>
                    )}
                  </button>
                ))}
                {items.length === 0 && (
                  <p className="col-span-full py-8 text-center text-sm text-ink-500">
                    No media yet — upload your first file.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
