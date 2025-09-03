import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const bankConnectionTable = pgTable("bank_connections", {
  id: uuid("id").primaryKey(),
  referenceId: uuid("reference_id").unique().notNull(),

  agreementId: uuid("agreement_id").unique().notNull(),
  institutionId: varchar("institution_id", { length: 256 }).notNull(),
  institutionName: varchar("institution_name", { length: 256 }),
  institutionLogo: varchar("institution_logo", { length: 1024 }),

  maxHistoricalDays: integer("max_historical_days"),
  agreementCreationDate: timestamp("agreement_creation_date")
    .notNull()
    .defaultNow(),
  agreementExpirationDate: timestamp("agreement_expiration_date").notNull(),

  requisitionId: uuid("requisition_id").unique(),
  requisitionCreationDate: timestamp("requisition_creation_date"),
});
