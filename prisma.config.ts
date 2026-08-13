import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
  // For adapter-free `prisma-client` with the query compiler, no driver
  // adapter is required by default. If you use a connection pooler, add:
  // directUrl: env("DIRECT_URL"),
});