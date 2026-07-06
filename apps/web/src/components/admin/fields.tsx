"use client";

import { useState } from "react";
import { MediaPicker } from "./MediaPicker";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "boolean"
  | "tags"
  | "select"
  | "url"
  | "date"
  | "media"
  | "json";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  help?: string;
  colSpan?: 1 | 2;
}

interface FieldProps {
  field: FieldConfig;
  value: unknown;
  onChange: (v: unknown) => void;
}

const inputCls =
  "w-full rounded-lg border border-base-700 bg-base-950 px-3 py-2.5 text-sm text-ink-100 outline-none transition-colors focus:border-accent-500/60";

/** Raw JSON editor that only propagates valid JSON upward. */
function JsonField({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const [text, setText] = useState(() =>
    JSON.stringify(value ?? [], null, 2),
  );
  const [error, setError] = useState("");

  return (
    <>
      <textarea
        value={text}
        rows={6}
        spellCheck={false}
        onChange={(e) => {
          setText(e.target.value);
          try {
            onChange(JSON.parse(e.target.value));
            setError("");
          } catch {
            setError("Invalid JSON — changes paused until fixed");
          }
        }}
        className={`${inputCls} font-mono text-xs`}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </>
  );
}

export function Field({ field, value, onChange }: FieldProps) {
  const label = (
    <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink-500">
      {field.label}
      {field.required && <span className="text-accent-500"> *</span>}
    </label>
  );

  const help = field.help ? (
    <p className="mt-1 text-xs text-ink-600">{field.help}</p>
  ) : null;

  switch (field.type) {
    case "textarea":
    case "richtext":
      return (
        <div className={field.colSpan === 2 ? "sm:col-span-2" : ""}>
          {label}
          <textarea
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            rows={field.type === "richtext" ? 8 : 4}
            className={`${inputCls} resize-y`}
          />
          {help}
        </div>
      );

    case "number":
      return (
        <div>
          {label}
          <input
            type="number"
            value={value === null || value === undefined ? "" : Number(value)}
            onChange={(e) =>
              onChange(e.target.value === "" ? null : Number(e.target.value))
            }
            className={inputCls}
          />
          {help}
        </div>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between rounded-lg border border-base-700 bg-base-950 px-3 py-2.5">
          <span className="text-sm text-ink-200">{field.label}</span>
          <button
            type="button"
            onClick={() => onChange(!value)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              value ? "bg-accent-500" : "bg-base-600"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-base-950 transition-transform ${
                value ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      );

    case "tags":
      return (
        <div className={field.colSpan === 2 ? "sm:col-span-2" : ""}>
          {label}
          <input
            value={Array.isArray(value) ? (value as string[]).join(", ") : ""}
            placeholder="comma, separated, values"
            onChange={(e) =>
              onChange(
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            className={inputCls}
          />
          {help}
        </div>
      );

    case "select":
      return (
        <div>
          {label}
          <select
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          >
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {help}
        </div>
      );

    case "media":
      return (
        <div className={field.colSpan === 2 ? "sm:col-span-2" : ""}>
          {label}
          <MediaPicker
            value={(value as string) ?? null}
            onChange={(id) => onChange(id)}
          />
          {help}
        </div>
      );

    case "json":
      return (
        <div className={field.colSpan === 2 ? "sm:col-span-2" : ""}>
          {label}
          <JsonField value={value} onChange={onChange} />
          {help}
        </div>
      );

    default:
      return (
        <div className={field.colSpan === 2 ? "sm:col-span-2" : ""}>
          {label}
          <input
            type={field.type === "url" ? "url" : "text"}
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
          {help}
        </div>
      );
  }
}
