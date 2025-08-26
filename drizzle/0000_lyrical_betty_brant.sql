CREATE TYPE "public"."transaction_type" AS ENUM('INCOMING', 'OUTGOING');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"bank_connection_id" uuid,
	"institution_id" varchar(256) NOT NULL,
	"institution_name" varchar(256) NOT NULL,
	"institution_logo_url" varchar(256),
	"institution_resource_id" varchar(256) NOT NULL,
	"iban" varchar(256) NOT NULL,
	"currency" varchar(256) NOT NULL,
	"bban" varchar(256),
	"status" varchar(256),
	"owner_name" varchar(256),
	"name" varchar(256),
	"product" varchar(256),
	"cash_account_type" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "balances" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(256) NOT NULL,
	"type" varchar(256),
	"reference_date" date DEFAULT now() NOT NULL,
	CONSTRAINT "balances_account_id_type_unique" UNIQUE("account_id","type")
);
--> statement-breakpoint
CREATE TABLE "bank_connections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"reference_id" uuid NOT NULL,
	"institution_id" varchar(256) NOT NULL,
	"agreement_id" uuid NOT NULL,
	"requisition_id" uuid,
	"max_historical_days" integer NOT NULL,
	"valid_for" integer NOT NULL,
	"agreement_creation_date" timestamp DEFAULT now() NOT NULL,
	"agreement_expiration_date" timestamp NOT NULL,
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
	"description" varchar(1024)
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bank_connection_id_bank_connections_id_fk" FOREIGN KEY ("bank_connection_id") REFERENCES "public"."bank_connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "balances" ADD CONSTRAINT "balances_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;