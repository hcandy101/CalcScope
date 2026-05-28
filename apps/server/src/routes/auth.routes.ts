import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

export const authRouter = Router();

// These routes define the public auth surface now. The real bcrypt/JWT logic
// will be added behind the controller/service boundary in a later feature.
authRouter.post("/register", register);
authRouter.post("/login", login);
