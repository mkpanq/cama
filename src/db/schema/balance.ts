import { date, numeric, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import { accountsTable } from "./account";

export const balancesTable = pgTable("balances", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => authUsers.id)
    .notNull(),
  accountId: uuid("account_id")
    .references(() => accountsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  amount: numeric("amount", {
    precision: 10,
    scale: 2,
    mode: "number",
  }).notNull(),
  currency: varchar("currency", { length: 256 }).notNull(),
  type: varchar("type", { length: 256 }),
  referenceDate: date("reference_date", { mode: "date" })
    .notNull()
    .defaultNow(),
});
