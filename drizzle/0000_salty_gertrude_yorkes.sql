CREATE TABLE "agreements" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"institution_id" varchar(256) NOT NULL,
	"max_historical_days" integer NOT NULL,
	"valid_for" integer NOT NULL,
	"creation_date" timestamp DEFAULT now() NOT NULL,
	"acceptance_date" timestamp DEFAULT now() NOT NULL,
	"expiration_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "requisitions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"institution_id" varchar(256) NOT NULL,
	"agreement_id" uuid,
	"creation_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requisitions" ADD CONSTRAINT "requisitions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "requisitions" ADD CONSTRAINT "requisitions_agreement_id_agreements_id_fk" FOREIGN KEY ("agreement_id") REFERENCES "public"."agreements"("id") ON DELETE no action ON UPDATE no action;