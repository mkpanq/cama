/** biome-ignore-all lint/style/noNonNullAssertion: DATABASE_URL always must be defined. */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export default async function getDBClient() {
  const client = postgres(process.env.DATABASE_URL!);

  return drizzle({ client });
}
