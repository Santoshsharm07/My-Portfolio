import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../lib/http-error.js";
import { logger } from "../lib/logger.js";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: { message: "Not found", code: "not_found" } });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: { message: err.message, code: err.code, details: err.details },
    });
    return;
  }
  logger.error({ err }, "Unhandled error");
  const message =
    err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ error: { message, code: "internal" } });
}

/** Wraps async handlers so rejections flow to the error middleware. */
export function asyncHandler<
  T extends (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
>(fn: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
