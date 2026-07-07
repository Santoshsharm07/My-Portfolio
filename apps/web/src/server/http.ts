import { NextResponse } from "next/server";

/** Error carrying an HTTP status + machine code, mapped to the JSON envelope. */
export class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(status: number, message: string, code: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (what = "Resource") =>
  new HttpError(404, `${what} not found`, "not_found");
export const badRequest = (msg: string, details?: unknown) =>
  new HttpError(400, msg, "bad_request", details);
export const unauthorized = (msg = "Unauthorized") =>
  new HttpError(401, msg, "unauthorized");

/** Success envelope: `{ data }`, matching the previous Express API. */
export function ok(data: unknown, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/** Maps any thrown value to the `{ error: { message, code, details } }` envelope. */
export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof HttpError) {
    return NextResponse.json(
      { error: { message: err.message, code: err.code, details: err.details } },
      { status: err.status },
    );
  }
  // Supabase / Postgres errors expose `message`; surface it without leaking internals.
  const message =
    err instanceof Error ? err.message : "Internal server error";
  return NextResponse.json(
    { error: { message, code: "internal" } },
    { status: 500 },
  );
}

/**
 * Wraps a route handler so thrown HttpErrors / rejections become JSON envelopes
 * instead of crashing the request.
 */
export function handle<Args extends unknown[]>(
  fn: (...args: Args) => Promise<NextResponse>,
) {
  return async (...args: Args): Promise<NextResponse> => {
    try {
      return await fn(...args);
    } catch (err) {
      return toErrorResponse(err);
    }
  };
}

/** Parse a JSON body, tolerating empty bodies (returns {}). */
export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    return (body ?? {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}
