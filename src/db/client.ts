/** biome-ignore-all lint/style/noNonNullAssertion: DATABASE variables always must be defined. */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let dbInstance: ReturnType<typeof drizzle> | null = null;

// TODO: Think about better error handling from the Database
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
