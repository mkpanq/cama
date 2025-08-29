import {
  pgTable,
  uuid,
  varchar,
  numeric,
  pgEnum,
  date,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { accountsTable } from "./account";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "INCOMING",
  "OUTGOING",
]);

export const transactionsTable = pgTable("transactions", {
  id: uuid("id").primaryKey(),
  accountId: uuid("account_id")
    .references(() => accountsTable.id, { onDelete: "cascade" })
    .notNull(),
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
  // Extended fields from API schema
  transactionId: varchar("transaction_id", { length: 256 }),
  entryReference: varchar("entry_reference", { length: 256 }),
  endToEndId: varchar("end_to_end_id", { length: 256 }),
  mandateId: varchar("mandate_id", { length: 256 }),
  checkId: varchar("check_id", { length: 256 }),
  creditorId: varchar("creditor_id", { length: 256 }),
  valueDate: date("value_date", { mode: "date" }),
  bookingDateTime: timestamp("booking_date_time", { mode: "date" }),
  valueDateTime: timestamp("value_date_time", { mode: "date" }),
  currencyExchange:
    jsonb("currency_exchange").$type<
      Array<{
        sourceCurrency?: string;
        exchangeRate?: string;
        unitCurrency?: string;
        targetCurrency?: string;
        quotationDate?: string;
        contractIdentification?: string;
      }>
    >(),
  creditorName: varchar("creditor_name", { length: 256 }),
  creditorAccount: jsonb("creditor_account").$type<{
    iban?: string;
    bban?: string;
    pan?: string;
    maskedPan?: string;
    msisdn?: string;
    currency?: string;
  }>(),
  ultimateCreditor: varchar("ultimate_creditor", { length: 256 }),
  debtorName: varchar("debtor_name", { length: 256 }),
  debtorAccount: jsonb("debtor_account").$type<{
    iban?: string;
    bban?: string;
    pan?: string;
    maskedPan?: string;
    msisdn?: string;
    currency?: string;
  }>(),
  ultimateDebtor: varchar("ultimate_debtor", { length: 256 }),
  remittanceInformationUnstructured: varchar("remittance_unstructured", {
    length: 2048,
  }),
  remittanceInformationUnstructuredArray: jsonb(
    "remittance_unstructured_array",
  ).$type<string[]>(),
  remittanceInformationStructured: varchar("remittance_structured", {
    length: 2048,
  }),
  remittanceInformationStructuredArray: jsonb(
    "remittance_structured_array",
  ).$type<string[]>(),
  additionalInformation: varchar("additional_information", { length: 2048 }),
  purposeCode: varchar("purpose_code", { length: 256 }),
  bankTransactionCode: varchar("bank_transaction_code", { length: 256 }),
  proprietaryBankTransactionCode: varchar("proprietary_bank_transaction_code", {
    length: 256,
  }),
  internalTransactionId: varchar("internal_transaction_id", { length: 256 }),
  balanceAfterTransactionAmount: numeric("balance_after_amount", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),
  balanceAfterTransactionCurrency: varchar("balance_after_currency", {
    length: 8,
  }),
});
