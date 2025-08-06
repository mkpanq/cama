import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import { agreementsTable } from "./agreement";

export const requisitionTable = pgTable("requisitions", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => authUsers.id),
  institutionId: varchar("institution_id", { length: 256 }).notNull(),
  agreementId: uuid("agreement_id").references(() => agreementsTable.id),
  creationDate: timestamp("creation_date").notNull().defaultNow(),
});
