import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const agreementsTable = pgTable("agreements", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => authUsers.id),
  institutionId: varchar("institution_id", { length: 256 }).notNull().unique(),
  maxHistoricalDays: integer("max_historical_days").notNull(),
  validFor: integer("valid_for").notNull(),
  creationDate: timestamp("creation_date").notNull().defaultNow(),
  acceptanceDate: timestamp("acceptance_date").notNull().defaultNow(),
  expirationDate: timestamp("expiration_date").notNull(),
});
