/** biome-ignore-all lint/style/noNonNullAssertion: DATABASE_URL always must be defined. */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// TODO: Set default userId automatically, whenever user has active session?
// TODO: Database connections limit - we need to handle the error that appeared during development: - ``[Error [PostgresError]: remaining connection slots are reserved for roles with the SUPERUSER attribute``
export default async function getDBClient() {
  const client = postgres(process.env.DATABASE_URL!);

  return drizzle({ client });
}
