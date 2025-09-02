import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { bankConnectionTable } from "./bankConnection";

export const accountsTable = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  bankConnectionId: uuid("bank_connection_id").references(
    () => bankConnectionTable.id,
    { onDelete: "cascade" },
  ),
  institutionId: varchar("institution_id", { length: 256 }).notNull(),
  institutionName: varchar("institution_name", { length: 256 }).notNull(),
  institutionLogoUrl: varchar("institution_logo_url", { length: 256 }),
  iban: varchar("iban", { length: 256 }).notNull(),
  currency: varchar("currency", { length: 256 }),
  bban: varchar("bban", { length: 256 }),
  status: varchar("status", { length: 256 }),
  ownerName: varchar("owner_name", { length: 256 }),
  name: varchar("name", { length: 256 }),
  createdAt: timestamp("created_at", { mode: "date" }),
  lastAccessed: timestamp("last_accessed", { mode: "date" }),
  lastSync: timestamp("last_sync", { mode: "date" }),
});
