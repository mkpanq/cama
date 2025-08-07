import {
  decimal,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
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
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 256 }).notNull(),
  type: varchar("type", { length: 256 }),
  referenceDate: timestamp("reference_date").notNull(),
});

// Raw type (for API)
// {
//   "balances": [
//     {
//       "balanceAmount": {
//         "amount": "657.49",
//         "currency": "string"
//       },
//       "balanceType": "string",
//       "referenceDate": "2021-11-22"
//     },
//     {
//       "balanceAmount": {
//         "amount": "185.67",
//         "currency": "string"
//       },
//       "balanceType": "string",
//       "referenceDate": "2021-11-19"
//     }
//   ]
// }
