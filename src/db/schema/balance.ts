import {
  date,
  numeric,
  pgTable,
  unique,
  uuid,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { accountsTable } from "./account";

export const balancesTable = pgTable(
  "balances",
  {
    id: uuid("id").primaryKey(),
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
    creditLimitIncluded: boolean("credit_limit_included"),
    lastChangeDateTime: timestamp("last_change_datetime", { mode: "date" }),
    lastCommittedTransaction: varchar("last_committed_transaction", {
      length: 256,
    }),
  },
  (t) => [unique().on(t.accountId, t.type)],
);
