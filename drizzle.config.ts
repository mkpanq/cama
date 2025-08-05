/** biome-ignore-all lint/style/noNonNullAssertion: DATABASE_URL must be always defined in the environment variables. */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schemaFilter: ["public"],
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
