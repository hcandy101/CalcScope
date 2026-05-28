import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

// A single Pool should be shared across the backend. It manages PostgreSQL
// connections efficiently instead of opening a new connection for every request.
export const db = new Pool({
  connectionString: env.databaseUrl
});

export async function checkDatabaseConnection(): Promise<boolean> {
  const result = await db.query("SELECT 1 AS ok");
  return result.rows[0]?.ok === 1;
}
