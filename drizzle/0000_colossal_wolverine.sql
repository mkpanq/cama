CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"bank_connection_id" uuid,
	"institution_id" varchar(256) NOT NULL,
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
CREATE TABLE "bank_connections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"reference_id" uuid NOT NULL,
	"institution_id" varchar(256) NOT NULL,
	"agreement_id" uuid NOT NULL,
	"requisition_id" uuid NOT NULL,
	"max_historical_days" integer NOT NULL,
	"valid_for" integer NOT NULL,
	"agreement_creation_date" timestamp DEFAULT now() NOT NULL,
	"agreement_acceptance_date" timestamp DEFAULT now() NOT NULL,
	"agreement_expiration_date" timestamp NOT NULL,
	"requisition_creation_date" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bank_connections_reference_id_unique" UNIQUE("reference_id"),
	CONSTRAINT "bank_connections_agreement_id_unique" UNIQUE("agreement_id"),
	CONSTRAINT "bank_connections_requisition_id_unique" UNIQUE("requisition_id")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bank_connection_id_bank_connections_id_fk" FOREIGN KEY ("bank_connection_id") REFERENCES "public"."bank_connections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_connections" ADD CONSTRAINT "bank_connections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;