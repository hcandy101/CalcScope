import type { NextFunction, Request, Response } from "express";
import { verifyAuthToken } from "../services/auth.service.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const decoded = verifyAuthToken(token);

    req.user = {
      id: decoded.sub,
      email: decoded.email
    };

    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}
