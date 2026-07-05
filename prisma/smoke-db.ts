import { randomUUID } from "node:crypto";

import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
config();

const connectionVariable = process.argv.includes("--pooled")
  ? "DATABASE_URL"
  : "DIRECT_URL";
const connectionString = process.env[connectionVariable];

if (!connectionString) {
  throw new Error(`${connectionVariable} is not configured.`);
}

const client = new pg.Client({ connectionString });
const word = `__smoke_${randomUUID()}`;

try {
  await client.connect();
  await client.query("BEGIN");
  await client.query(
    `INSERT INTO vocabulary
      (word, pronunciation, translation, example, example_translation, category, level, updated_at)
     VALUES ($1, '/smoke/', 'smoke', 'Smoke test.', 'Teste de fumaça.', 'Smoke', 'beginner', NOW())`,
    [word],
  );

  const inserted = await client.query<{ translation: string }>(
    "SELECT translation FROM vocabulary WHERE word = $1",
    [word],
  );
  if (inserted.rowCount !== 1) throw new Error("Smoke insert/read failed.");

  await client.query("UPDATE vocabulary SET translation = $2 WHERE word = $1", [
    word,
    "updated",
  ]);
  const updated = await client.query<{ translation: string }>(
    "SELECT translation FROM vocabulary WHERE word = $1",
    [word],
  );
  if (updated.rows[0]?.translation !== "updated") {
    throw new Error("Smoke update failed.");
  }

  await client.query("DELETE FROM vocabulary WHERE word = $1", [word]);
  const deleted = await client.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM vocabulary WHERE word = $1",
    [word],
  );
  if (deleted.rows[0]?.count !== "0") throw new Error("Smoke delete failed.");

  await client.query("ROLLBACK");
  console.info("Database smoke CRUD passed (transaction rolled back).\n");
} catch (error: unknown) {
  try {
    await client.query("ROLLBACK");
  } catch {
    // The connection may not have reached a transaction.
  }

  const details = error as { code?: string; name?: string };
  console.error(
    `Database smoke failed (name=${details.name ?? "unknown"}, code=${details.code ?? "unknown"}).`,
  );
  process.exitCode = 1;
} finally {
  await client.end().catch(() => undefined);
}
