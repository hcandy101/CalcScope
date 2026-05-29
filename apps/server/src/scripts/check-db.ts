import { db, checkDatabaseConnection } from "../config/db.js";

try {
  const isConnected = await checkDatabaseConnection();

  if (!isConnected) {
    throw new Error("Database returned an unexpected health check response.");
  }

  console.log("Database connection is working.");
} catch (error) {
  console.error("Could not connect to PostgreSQL.");
  console.error("Make sure PostgreSQL is running and DATABASE_URL in apps/server/.env is correct.");

  if (error instanceof Error && error.message) {
    console.error(`Reason: ${error.message}`);
  }

  process.exitCode = 1;
} finally {
  await db.end();
}
