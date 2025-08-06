CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"requisition_id" uuid,
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
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_requisition_id_requisitions_id_fk" FOREIGN KEY ("requisition_id") REFERENCES "public"."requisitions"("id") ON DELETE no action ON UPDATE no action;