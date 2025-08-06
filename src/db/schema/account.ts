// Account - metadata, details, IBAN, number etc.
// Balances
// Transactions

import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import { requisitionTable } from "./requisition";

export const accountsTable = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => authUsers.id),
  requisitionId: uuid("requisition_id").references(() => requisitionTable.id),
  institutionId: varchar("institution_id", { length: 256 }).notNull(),
  institutionResourceId: varchar("institution_resource_id", {
    length: 256,
  }).notNull(),
  iban: varchar("iban", { length: 256 }).notNull(),
  currency: varchar("currency", { length: 256 }).notNull(),
  bban: varchar("bban", { length: 256 }),
  status: varchar("status", { length: 256 }),
  ownerName: varchar("owner_name", { length: 256 }),
  name: varchar("name", { length: 256 }),
  product: varchar("product", { length: 256 }),
  cashAccountType: varchar("cash_account_type", { length: 256 }),
});
