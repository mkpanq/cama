import {
  pgTable,
  uuid,
  varchar,
  numeric,
  pgEnum,
  date,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { accountsTable } from "./account";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "INCOMING",
  "OUTGOING",
]);

export const transactionsTable = pgTable("transactions", {
  // Use a flexible string PK to store API ids (internal/transactionId)
  id: varchar("id", { length: 256 }).primaryKey(),
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
  // API-aligned optional fields
  transactionId: varchar("transaction_id", { length: 256 }),
  internalTransactionId: varchar("internal_transaction_id", { length: 256 }),
  entryReference: varchar("entry_reference", { length: 256 }),
  endToEndId: varchar("end_to_end_id", { length: 256 }),
  mandateId: varchar("mandate_id", { length: 256 }),
  checkId: varchar("check_id", { length: 256 }),
  creditorId: varchar("creditor_id", { length: 256 }),
  bookingDateTime: timestamp("booking_date_time", { mode: "date" }),
  valueDate: date("value_date", { mode: "date" }),
  valueDateTime: timestamp("value_date_time", { mode: "date" }),
  currencyExchange: json("currency_exchange"),
  creditorName: varchar("creditor_name", { length: 256 }),
  creditorAccountIban: varchar("creditor_account_iban", { length: 256 }),
  creditorAccountBban: varchar("creditor_account_bban", { length: 256 }),
  creditorAccountPan: varchar("creditor_account_pan", { length: 256 }),
  creditorAccountMaskedPan: varchar("creditor_account_masked_pan", {
    length: 256,
  }),
  creditorAccountMsisdn: varchar("creditor_account_msisdn", { length: 64 }),
  creditorAccountCurrency: varchar("creditor_account_currency", { length: 8 }),
  ultimateCreditor: varchar("ultimate_creditor", { length: 256 }),
  debtorName: varchar("debtor_name", { length: 256 }),
  debtorAccountIban: varchar("debtor_account_iban", { length: 256 }),
  debtorAccountBban: varchar("debtor_account_bban", { length: 256 }),
  debtorAccountPan: varchar("debtor_account_pan", { length: 256 }),
  debtorAccountMaskedPan: varchar("debtor_account_masked_pan", { length: 256 }),
  debtorAccountMsisdn: varchar("debtor_account_msisdn", { length: 64 }),
  debtorAccountCurrency: varchar("debtor_account_currency", { length: 8 }),
  ultimateDebtor: varchar("ultimate_debtor", { length: 256 }),
  remittanceInformationUnstructured: varchar(
    "remittance_information_unstructured",
    { length: 2048 },
  ),
  remittanceInformationUnstructuredArray: json(
    "remittance_information_unstructured_array",
  ),
  remittanceInformationStructured: varchar(
    "remittance_information_structured",
    { length: 2048 },
  ),
  remittanceInformationStructuredArray: json(
    "remittance_information_structured_array",
  ),
  additionalInformation: varchar("additional_information", { length: 2048 }),
  purposeCode: varchar("purpose_code", { length: 64 }),
  bankTransactionCode: varchar("bank_transaction_code", { length: 256 }),
  proprietaryBankTransactionCode: varchar("proprietary_bank_transaction_code", {
    length: 256,
  }),
  balanceAfterTransactionAmount: numeric("balance_after_transaction_amount", {
    precision: 10,
    scale: 2,
    mode: "number",
  }),
  balanceAfterTransactionCurrency: varchar(
    "balance_after_transaction_currency",
    { length: 8 },
  ),
});
