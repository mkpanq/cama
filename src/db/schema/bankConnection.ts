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

  institutionId: varchar("institution_id", { length: 256 }).notNull(),
  agreementId: uuid("agreement_id").unique().notNull(),
  requisitionId: uuid("requisition_id").unique(),

  maxHistoricalDays: integer("max_historical_days").notNull(),
  validFor: integer("valid_for").notNull(),
  agreementCreationDate: timestamp("agreement_creation_date")
    .notNull()
    .defaultNow(),
  agreementExpirationDate: timestamp("agreement_expiration_date").notNull(),
  requisitionCreationDate: timestamp("requisition_creation_date"),
});
