/** biome-ignore-all lint/style/noNonNullAssertion: DATABASE_URL always must be defined. */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// TODO: Set default userId automatically - setup RLS
let dbInstance: ReturnType<typeof drizzle> | null = null;

export default function getDbClient() {
  if (!dbInstance) {
    const client = postgres({
      port: parseInt(process.env.DB_PORT!),
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
    });
    dbInstance = drizzle(client);
  }

  return dbInstance;
}
