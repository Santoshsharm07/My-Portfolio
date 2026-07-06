import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { authRouter } from "./routes/auth.js";
import { publicRouter } from "./routes/public.js";
import { adminRouter } from "./routes/admin.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

export function createApp(): Application {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.webOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));

  const api = express.Router();

  // Health
  api.get("/health", (_req, res) => res.json({ status: "ok" }));

  // Tight limits on abuse-prone endpoints
  const loginLimiter = rateLimit({ windowMs: 15 * 60_000, max: 20 });
  const contactLimiter = rateLimit({ windowMs: 60 * 60_000, max: 10 });

  api.use("/auth/login", loginLimiter);
  api.use("/messages", contactLimiter);

  api.use("/auth", authRouter);
  api.use("/", publicRouter);
  api.use("/admin", adminRouter);

  app.use("/api/v1", api);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
