import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { bankConnectionTable } from "./bankConnection";

export const accountsTable = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  bankConnectionId: uuid("bank_connection_id").references(
    () => bankConnectionTable.id,
    { onDelete: "cascade" },
  ),
  // API-aligned fields
  created: timestamp("created", { mode: "date" }).notNull(),
  lastAccessed: timestamp("last_accessed", { mode: "date" }).notNull(),
  iban: varchar("iban", { length: 256 }).notNull(),
  bban: varchar("bban", { length: 256 }),
  status: varchar("status", { length: 256 }),
  institutionId: varchar("institution_id", { length: 256 }).notNull(),
  ownerName: varchar("owner_name", { length: 256 }),
  name: varchar("name", { length: 256 }),
  // existing extra fields kept as-is
  institutionName: varchar("institution_name", { length: 256 }).notNull(),
  institutionLogoUrl: varchar("institution_logo_url", { length: 256 }),
  currency: varchar("currency", { length: 256 }),
  lastSync: timestamp("last_sync", { mode: "date" }),
});
