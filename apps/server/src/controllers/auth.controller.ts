import type { Request, Response } from "express";
import { AuthError, getUserById, loginUser, registerUser } from "../services/auth.service.js";

function handleAuthError(error: unknown, res: Response) {
  if (error instanceof AuthError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Something went wrong." });
}

export async function register(req: Request, res: Response) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleAuthError(error, res);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    handleAuthError(error, res);
  }
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    res.status(401).json({ message: "Authentication required." });
    return;
  }

  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.json({ user });
  } catch (error) {
    handleAuthError(error, res);
  }
}
