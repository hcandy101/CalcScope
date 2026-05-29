import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../config/db.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(scriptDirectory, "../../migrations");

type MigrationRow = {
  name: string;
};

async function ensureMigrationsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrationNames(): Promise<Set<string>> {
  const result = await db.query<MigrationRow>("SELECT name FROM schema_migrations");
  return new Set(result.rows.map((row) => row.name));
}

async function runMigration(name: string, sql: string) {
  await db.query("BEGIN");

  try {
    await db.query(sql);
    await db.query("INSERT INTO schema_migrations (name) VALUES ($1)", [name]);
    await db.query("COMMIT");
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
}

try {
  await ensureMigrationsTable();

  const appliedMigrationNames = await getAppliedMigrationNames();
  const migrationFileNames = (await fs.readdir(migrationsDirectory))
    .filter((fileName) => fileName.endsWith(".sql"))
    .sort();

  let appliedCount = 0;

  for (const fileName of migrationFileNames) {
    if (appliedMigrationNames.has(fileName)) {
      continue;
    }

    const migrationPath = path.join(migrationsDirectory, fileName);
    const sql = await fs.readFile(migrationPath, "utf8");

    console.log(`Running migration ${fileName}`);
    await runMigration(fileName, sql);
    appliedCount += 1;
  }

  if (appliedCount === 0) {
    console.log("Database is already up to date.");
  } else {
    console.log(`Applied ${appliedCount} migration${appliedCount === 1 ? "" : "s"}.`);
  }
} catch (error) {
  console.error("Could not run database migrations.");
  console.error("Make sure PostgreSQL is running and DATABASE_URL in apps/server/.env is correct.");

  if (error instanceof Error && error.message) {
    console.error(`Reason: ${error.message}`);
  }

  process.exitCode = 1;
} finally {
  await db.end();
}
