import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

import { PrismaClient } from "../src/generated/prisma/client";
import { runSeed, type SeedClient } from "./seed/run-seed";

config({ path: ".env.local" });
config();

export async function main() {
  const connectionString = process.env.DIRECT_URL;

  if (!connectionString) {
    throw new Error("Defina DIRECT_URL antes de executar o seed.");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    const counts = await runSeed(prisma as unknown as SeedClient);
    console.info(
      `Seed concluído: ${counts.vocabulary} palavras, ${counts.achievements} conquistas e ${counts.dailyMissions} missões.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

const entrypoint = process.argv[1];

if (entrypoint && import.meta.url === pathToFileURL(resolve(entrypoint)).href) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
