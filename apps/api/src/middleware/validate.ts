import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny, infer as zInfer } from "zod";
import { badRequest } from "../lib/http-error.js";

/** Validates req.body against a Zod schema, replacing it with the parsed value. */
export function validateBody<T extends ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        badRequest("Validation failed", result.error.flatten()),
      );
    }
    req.body = result.data as zInfer<T>;
    next();
  };
}
