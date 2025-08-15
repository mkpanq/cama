/** biome-ignore-all lint/style/noNonNullAssertion: DATABASE_URL always must be defined. */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// TODO: Set default userId automatically - setup RLS
let dbInstance: ReturnType<typeof drizzle> | null = null;

export default function getDbClient() {
  if (!dbInstance) {
    const client = postgres(process.env.DATABASE_URL!);
    dbInstance = drizzle(client);
  }

  return dbInstance;
}
