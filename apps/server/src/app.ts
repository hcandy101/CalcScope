import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { healthRouter } from "./routes/health.routes.js";

export const app = express();

function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  return env.clientUrls.includes(origin);
}

// CORS keeps the browser app and API separated while still allowing local dev.
app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true
  })
);

app.use(express.json());

// All API routes live under /api so the frontend has one predictable base URL.
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);
