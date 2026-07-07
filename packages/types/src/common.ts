import { z } from "zod";

export const uuid = z.string().uuid();
export const isoDate = z.string().datetime({ offset: true });

/** Base columns present on every row. */
export const baseEntity = z.object({
  id: uuid,
  created_at: isoDate,
  updated_at: isoDate,
});

export const skillCategory = z.enum([
  "frontend",
  "backend",
  "design",
  "devops",
  "mobile",
  "tools",
  "other",
  "programming",
  "ai_genai",
  "frameworks",
  "data_analytics",
  "databases",
  "cloud_mlops",
  "ai_apis",
  "domain_expertise",
]);
export type SkillCategory = z.infer<typeof skillCategory>;

/** Standard API envelopes. */
export const apiError = z.object({
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.unknown().optional(),
  }),
});
export type ApiError = z.infer<typeof apiError>;

export function paginated<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    total: z.number().int(),
    page: z.number().int(),
    pageSize: z.number().int(),
  });
}

/** Helper: build create/update schemas from a full-row schema. */
export const optionalNullable = <T extends z.ZodTypeAny>(s: T) =>
  s.nullish();

/**
 * Field helpers for admin-editable optional columns. Admin forms omit blank
 * fields (key absent) or send empty strings; the DB stores NULL. These accept
 * `undefined` / `""` and normalise both to `null` so create/update never fails
 * validation on an untouched optional field.
 */
const blankToNull = (v: unknown) => (v === "" || v === undefined ? null : v);

/** Optional foreign-key id (media references, etc.). */
export const optionalId = z.preprocess(blankToNull, uuid.nullable());

/** Optional URL — normalises "" / missing to null, else must be a valid URL. */
export const optionalUrl = z.preprocess(
  blankToNull,
  z.string().url().nullable(),
);

/** Optional email — normalises "" / missing to null, else must be valid. */
export const optionalEmail = z.preprocess(
  blankToNull,
  z.string().email().nullable(),
);

/** Optional free-text (dates, ids) — "" / missing → null, else a string. */
export const optionalText = z.preprocess(blankToNull, z.string().nullable());

/** Optional integer — "" / missing → null, else an int. */
export const optionalNumber = z.preprocess(
  blankToNull,
  z.number().int().nullable(),
);
