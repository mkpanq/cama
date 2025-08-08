import {
  pgTable,
  uuid,
  varchar,
  numeric,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";
import { accountsTable } from "./account";
import { authUsers } from "drizzle-orm/supabase";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "INCOMING",
  "OUTGOING",
]);

export const transactionsTable = pgTable("transactions", {
  id: uuid("id").primaryKey(),
  accountId: uuid("account_id")
    .references(() => accountsTable.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => authUsers.id)
    .notNull(),
  transactionId: varchar("transaction_id", { length: 256 }).notNull(),
  internalTransactionId: varchar("internal_transaction_id", {
    length: 256,
  }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  bookingDate: date("booking_date", { mode: "date" }).notNull(),
  amount: numeric("amount", {
    precision: 10,
    scale: 2,
    mode: "number",
  }).notNull(),
  currency: varchar("currency", { length: 8 }).notNull(),
  counterpartyName: varchar("counterparty_name", { length: 256 }),
  counterpartyIban: varchar("counterparty_iban", { length: 256 }),
  transactionCode: varchar("transaction_code", { length: 256 }),
  description: varchar("description", { length: 1024 }),
});
