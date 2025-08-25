/** biome-ignore-all lint/style/noNonNullAssertion: DATABASE_URL must be always defined in the environment variables. */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schemaFilter: ["public"],
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    port: parseInt(process.env.DB_PORT!),
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
});
