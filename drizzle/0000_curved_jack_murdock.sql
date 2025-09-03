CREATE TYPE "public"."transaction_type" AS ENUM('INCOMING', 'OUTGOING');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"bank_connection_id" uuid,
	"institution_id" varchar(256) NOT NULL,
	"institution_name" varchar(256) NOT NULL,
	"institution_logo_url" varchar(256),
	"iban" varchar(256) NOT NULL,
	"currency" varchar(256),
	"bban" varchar(256),
	"status" varchar(256),
	"owner_name" varchar(256),
	"name" varchar(256),
	"created_at" timestamp,
	"last_accessed" timestamp,
	"last_sync" timestamp
);
--> statement-breakpoint
CREATE TABLE "balances" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(256) NOT NULL,
	"type" varchar(256),
	"reference_date" date,
	"credit_limit_included" boolean,
	"last_change_datetime" timestamp,
	"last_committed_transaction" varchar(256),
	CONSTRAINT "balances_account_id_type_unique" UNIQUE("account_id","type")
);
--> statement-breakpoint
CREATE TABLE "bank_connections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"reference_id" uuid NOT NULL,
	"agreement_id" uuid NOT NULL,
	"institution_id" varchar(256) NOT NULL,
	"institution_name" varchar(256),
	"institution_logo" varchar(1024),
	"max_historical_days" integer,
	"agreement_creation_date" timestamp DEFAULT now() NOT NULL,
	"agreement_expiration_date" timestamp NOT NULL,
	"requisition_id" uuid,
	"requisition_creation_date" timestamp,
	CONSTRAINT "bank_connections_reference_id_unique" UNIQUE("reference_id"),
	CONSTRAINT "bank_connections_agreement_id_unique" UNIQUE("agreement_id"),
	CONSTRAINT "bank_connections_requisition_id_unique" UNIQUE("requisition_id")
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"type" "transaction_type" NOT NULL,
	"booking_date" date NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(8) NOT NULL,
	"counterparty_name" varchar(256),
	"counterparty_iban" varchar(256),
	"transaction_code" varchar(256),
	"description" varchar(1024),
	"transaction_id" varchar(256),
	"entry_reference" varchar(256),
	"end_to_end_id" varchar(256),
	"mandate_id" varchar(256),
	"check_id" varchar(256),
	"creditor_id" varchar(256),
	"value_date" date,
	"booking_date_time" timestamp,
	"value_date_time" timestamp,
	"currency_exchange" jsonb,
	"creditor_name" varchar(256),
	"creditor_account" jsonb,
	"ultimate_creditor" varchar(256),
	"debtor_name" varchar(256),
	"debtor_account" jsonb,
	"ultimate_debtor" varchar(256),
	"remittance_unstructured" varchar(2048),
	"remittance_unstructured_array" jsonb,
	"remittance_structured" varchar(2048),
	"remittance_structured_array" jsonb,
	"additional_information" varchar(2048),
	"purpose_code" varchar(256),
	"bank_transaction_code" varchar(256),
	"proprietary_bank_transaction_code" varchar(256),
	"internal_transaction_id" varchar(256),
	"balance_after_amount" numeric(10, 2),
	"balance_after_currency" varchar(8)
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bank_connection_id_bank_connections_id_fk" FOREIGN KEY ("bank_connection_id") REFERENCES "public"."bank_connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balances" ADD CONSTRAINT "balances_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;