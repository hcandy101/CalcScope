import type { NextFunction, Request, Response } from "express";
import { AuthError } from "../services/auth.service.js";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof SyntaxError) {
    res.status(400).json({ message: "Request body must be valid JSON." });
    return;
  }

  if (error instanceof AuthError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Something went wrong." });
}
