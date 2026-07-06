"use client";

import { useEffect, useState } from "react";
import { adminApi, AdminApiError } from "@/lib/admin-api";
import { PageHeader } from "./AdminShell";
import { Field, type FieldConfig } from "./fields";
import { useToast } from "./Toast";

/**
 * Editor for a single-row resource (hero, about, site-settings).
 * GET /{path} → row; PUT /{path} → upsert.
 */
export function SingletonEditor({
  path,
  title,
  description,
  fields,
  defaults,
}: {
  path: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  defaults: Record<string, unknown>;
}) {
  const toast = useToast();
  const [data, setData] = useState<Record<string, unknown>>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const row = await adminApi<Record<string, unknown> | null>(`/${path}`);
        if (row) setData({ ...defaults, ...row });
      } catch (e) {
        toast(e instanceof Error ? e.message : "Failed to load", "error");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  async function save() {
    setSaving(true);
    try {
      const payload = { ...data };
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;
      await adminApi(`/${path}`, { method: "PUT", body: payload });
      toast(`${title} saved`);
    } catch (e) {
      const msg =
        e instanceof AdminApiError
          ? `${e.message}${e.details ? ` — ${JSON.stringify(e.details)}` : ""}`
          : "Save failed";
      toast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-ink-500">Loading…</p>;
  }

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-medium text-base-950 hover:bg-accent-400 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        }
      />
      <div className="max-w-3xl rounded-xl border border-base-800 bg-base-900/40 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <Field
              key={f.name}
              field={f}
              value={data[f.name]}
              onChange={(v) => setData((prev) => ({ ...prev, [f.name]: v }))}
            />
          ))}
        </div>
      </div>
    </>
  );
}
