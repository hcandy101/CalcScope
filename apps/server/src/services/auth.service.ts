import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;
const TOKEN_EXPIRES_IN = "1h";

type AuthUserRow = {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
  created_at: Date;
};

export type SafeUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export type AuthResult = {
  user: SafeUser;
  token: string;
};

export type AuthTokenPayload = {
  sub: string;
  email: string;
};

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}

function toSafeUser(row: AuthUserRow): SafeUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at.toISOString()
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function validateEmail(email: unknown): string {
  if (typeof email !== "string") {
    throw new AuthError("Email is required.", 400);
  }

  const normalizedEmail = normalizeEmail(email);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(normalizedEmail)) {
    throw new AuthError("Enter a valid email address.", 400);
  }

  return normalizedEmail;
}

function validatePassword(password: unknown): string {
  if (typeof password !== "string") {
    throw new AuthError("Password is required.", 400);
  }

  if (password.length < 8) {
    throw new AuthError("Password must be at least 8 characters long.", 400);
  }

  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    throw new AuthError("Password must include at least one letter and one number.", 400);
  }

  return password;
}

function validateName(name: unknown): string | null {
  if (name === undefined || name === null || name === "") {
    return null;
  }

  if (typeof name !== "string") {
    throw new AuthError("Name must be text.", 400);
  }

  const trimmedName = name.trim();

  if (trimmedName.length > 80) {
    throw new AuthError("Name must be 80 characters or fewer.", 400);
  }

  return trimmedName || null;
}

function createToken(user: SafeUser): string {
  return jwt.sign(
    {
      email: user.email
    },
    env.jwtSecret,
    {
      subject: user.id,
      expiresIn: TOKEN_EXPIRES_IN
    }
  );
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

export async function registerUser(input: {
  email: unknown;
  password: unknown;
  name?: unknown;
}): Promise<AuthResult> {
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);
  const name = validateName(input.name);

  const existingUser = await db.query<AuthUserRow>("SELECT id FROM users WHERE email = $1", [email]);

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    throw new AuthError("An account with that email already exists.", 409);
  }

  let result;

  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    result = await db.query<AuthUserRow>(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, password_hash, created_at`,
      [email, name, passwordHash]
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AuthError("An account with that email already exists.", 409);
    }

    throw error;
  }

  const user = toSafeUser(result.rows[0]);

  return {
    user,
    token: createToken(user)
  };
}

export async function loginUser(input: { email: unknown; password: unknown }): Promise<AuthResult> {
  const email = validateEmail(input.email);

  if (typeof input.password !== "string") {
    throw new AuthError("Email or password is incorrect.", 401);
  }

  const result = await db.query<AuthUserRow>(
    "SELECT id, email, name, password_hash, created_at FROM users WHERE email = $1",
    [email]
  );
  const userRow = result.rows[0];

  if (!userRow) {
    throw new AuthError("Email or password is incorrect.", 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, userRow.password_hash);

  if (!passwordMatches) {
    throw new AuthError("Email or password is incorrect.", 401);
  }

  const user = toSafeUser(userRow);

  return {
    user,
    token: createToken(user)
  };
}

export async function getUserById(userId: string): Promise<SafeUser | null> {
  const result = await db.query<AuthUserRow>(
    "SELECT id, email, name, password_hash, created_at FROM users WHERE id = $1",
    [userId]
  );
  const userRow = result.rows[0];

  return userRow ? toSafeUser(userRow) : null;
}
