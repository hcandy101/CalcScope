import type { NextFunction, Request, Response } from "express";

// Placeholder for future JWT verification. Routes that require a logged-in user
// will use this middleware once token validation is implemented.
export function requireAuth(_req: Request, res: Response, _next: NextFunction) {
  res.status(501).json({
    message: "Authentication middleware scaffolded. JWT verification is not implemented yet."
  });
}
