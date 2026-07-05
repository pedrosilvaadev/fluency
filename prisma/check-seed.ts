import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });
config();

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL is not configured.");
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();
  const result = await client.query<{
    vocabulary: number;
    uniqueVocabulary: number;
    achievements: number;
    uniqueAchievements: number;
    missions: number;
    uniqueMissions: number;
  }>(`
    SELECT
      (SELECT COUNT(*)::int FROM vocabulary) AS vocabulary,
      (SELECT COUNT(DISTINCT word)::int FROM vocabulary) AS "uniqueVocabulary",
      (SELECT COUNT(*)::int FROM achievements) AS achievements,
      (SELECT COUNT(DISTINCT code)::int FROM achievements) AS "uniqueAchievements",
      (SELECT COUNT(*)::int FROM daily_missions) AS missions,
      (SELECT COUNT(DISTINCT code)::int FROM daily_missions) AS "uniqueMissions"
  `);

  const counts = result.rows[0];
  if (!counts) throw new Error("Seed count query returned no rows.");

  const hasDuplicates =
    counts.vocabulary !== counts.uniqueVocabulary ||
    counts.achievements !== counts.uniqueAchievements ||
    counts.missions !== counts.uniqueMissions;

  if (hasDuplicates) throw new Error("Seed verification found duplicate keys.");

  console.info(
    `Seed verificado: ${counts.vocabulary} palavras, ${counts.achievements} conquistas e ${counts.missions} missões; nenhuma chave duplicada.`,
  );
} finally {
  await client.end().catch(() => undefined);
}
