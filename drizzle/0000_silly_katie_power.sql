CREATE TABLE "agreements" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"institution_id" varchar(256) NOT NULL,
	"max_historical_days" integer NOT NULL,
	"valid_for" integer NOT NULL,
	"creation_date" timestamp DEFAULT now() NOT NULL,
	"acceptance_date" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agreements_institution_id_unique" UNIQUE("institution_id")
);
--> statement-breakpoint
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;