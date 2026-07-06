export class HttpError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(status: number, message: string, code?: string, details?: unknown) {
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
