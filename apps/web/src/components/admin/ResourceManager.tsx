"use client";

import { useEffect, useState } from "react";
import { adminApi, AdminApiError } from "@/lib/admin-api";
import { PageHeader } from "./AdminShell";
import { Field, type FieldConfig } from "./fields";
import { useToast } from "./Toast";

export interface ResourceConfig<T> {
  /** API path under /admin, e.g. "projects". */
  path: string;
  title: string;
  description?: string;
  singular: string;
  fields: FieldConfig[];
  /** Columns shown in the list table. */
  columns: { key: keyof T & string; label: string; render?: (row: T) => string }[];
  defaults: Partial<T>;
}

type Row = Record<string, unknown> & { id: string };

export function ResourceManager<T extends Row>({
  config,
}: {
  config: ResourceConfig<T>;
}) {
  const toast = useToast();
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setRows(await adminApi<T[]>(`/${config.path}`));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to load", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.path]);

  function openNew() {
    setEditing({ ...config.defaults });
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const id = (editing as Partial<Row>).id;
      // Strip server-managed fields.
      const payload = { ...editing } as Record<string, unknown>;
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;

      if (id) {
        await adminApi(`/${config.path}/${id}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await adminApi(`/${config.path}`, { method: "POST", body: payload });
      }
      toast(`${config.singular} saved`);
      setEditing(null);
      await load();
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

  async function remove(id: string) {
    if (!confirm(`Delete this ${config.singular.toLowerCase()}?`)) return;
    try {
      await adminApi(`/${config.path}/${id}`, { method: "DELETE" });
      toast(`${config.singular} deleted`);
      setRows((r) => r.filter((x) => x.id !== id));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed", "error");
    }
  }

  return (
    <>
      <PageHeader
        title={config.title}
        description={config.description}
        action={
          <button
            onClick={openNew}
            className="rounded-full bg-accent-500 px-5 py-2.5 text-sm font-medium text-base-950 hover:bg-accent-400"
          >
            + New
          </button>
        }
      />

      <div className="overflow-hidden rounded-xl border border-base-800">
        <table className="w-full text-sm">
          <thead className="bg-base-900 text-left text-xs uppercase tracking-wider text-ink-500">
            <tr>
              {config.columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-base-800">
            {loading ? (
              <tr>
                <td
                  colSpan={config.columns.length + 1}
                  className="px-4 py-10 text-center text-ink-500"
                >
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={config.columns.length + 1}
                  className="px-4 py-10 text-center text-ink-500"
                >
                  No {config.title.toLowerCase()} yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-base-900/50">
                  {config.columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-ink-200">
                      {c.render
                        ? c.render(row)
                        : renderCell(row[c.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(row)}
                      className="mr-3 text-ink-400 hover:text-accent-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(row.id)}
                      className="text-ink-500 hover:text-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Drawer
          title={`${(editing as Row).id ? "Edit" : "New"} ${config.singular}`}
          onClose={() => setEditing(null)}
          onSave={save}
          saving={saving}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {config.fields.map((f) => (
              <Field
                key={f.name}
                field={f}
                value={(editing as Record<string, unknown>)[f.name]}
                onChange={(v) =>
                  setEditing((prev) => ({ ...prev, [f.name]: v }) as Partial<T>)
                }
              />
            ))}
          </div>
        </Drawer>
      )}
    </>
  );
}

function renderCell(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

export function Drawer({
  title,
  children,
  onClose,
  onSave,
  saving,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-base-950/70 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-2xl flex-col border-l border-base-800 bg-base-900">
        <div className="flex items-center justify-between border-b border-base-800 px-6 py-4">
          <h2 className="text-lg text-ink-50">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-500 hover:text-ink-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        <div className="flex justify-end gap-3 border-t border-base-800 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-full border border-base-700 px-5 py-2.5 text-sm text-ink-300 hover:border-base-500"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="rounded-full bg-accent-500 px-6 py-2.5 text-sm font-medium text-base-950 hover:bg-accent-400 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
