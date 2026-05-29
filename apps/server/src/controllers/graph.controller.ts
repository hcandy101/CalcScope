import type { NextFunction, Request, Response } from "express";
import { generateGraphPoints } from "../services/graph.service.js";

export function createGraphPoints(req: Request, res: Response, next: NextFunction) {
  try {
    const result = generateGraphPoints(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
