import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthTokenPayload } from "../services/auth.service.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as jwt.JwtPayload & AuthTokenPayload;

    if (!decoded.sub || !decoded.email) {
      res.status(401).json({ message: "Invalid authentication token." });
      return;
    }

    req.user = {
      id: decoded.sub,
      email: decoded.email
    };

    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}
