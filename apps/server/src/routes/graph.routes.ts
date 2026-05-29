import { Router } from "express";
import { createGraphPoints } from "../controllers/graph.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const graphRouter = Router();

// Graph generation is protected so saved user work can later reuse this route safely.
graphRouter.post("/points", requireAuth, createGraphPoints);
