import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  clientUrls: (process.env.CLIENT_URLS ?? process.env.CLIENT_URL ?? "http://localhost:5175")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)
};
