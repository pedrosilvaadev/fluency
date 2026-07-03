import "server-only";

import { z } from "zod";

const databaseEnvironmentSchema = z.object({
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
});

const serverEnvironmentSchema = z.object({
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  DIRECT_URL: z.string().url().startsWith("postgresql://"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type DatabaseEnvironment = z.infer<typeof databaseEnvironmentSchema>;
export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export function getDatabaseEnvironment(): DatabaseEnvironment {
  return databaseEnvironmentSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
  });
}

export function getServerEnvironment(): ServerEnvironment {
  return serverEnvironmentSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}
