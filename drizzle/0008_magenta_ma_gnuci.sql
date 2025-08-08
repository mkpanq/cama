CREATE TYPE "public"."transaction_type" AS ENUM('INCOMING', 'OUTGOING');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"transaction_id" varchar(256) NOT NULL,
	"internal_transaction_id" varchar(256) NOT NULL,
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
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;