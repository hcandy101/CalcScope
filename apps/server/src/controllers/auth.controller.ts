import type { Request, Response } from "express";
import { createLoginPlaceholder, createRegisterPlaceholder } from "../services/auth.service.js";

export function register(_req: Request, res: Response) {
  res.status(501).json(createRegisterPlaceholder());
}

export function login(_req: Request, res: Response) {
  res.status(501).json(createLoginPlaceholder());
}
