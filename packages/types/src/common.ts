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
