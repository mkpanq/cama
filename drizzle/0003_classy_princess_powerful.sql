ALTER TABLE "accounts" DROP CONSTRAINT "accounts_bank_connection_id_bank_connections_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_bank_connection_id_bank_connections_id_fk" FOREIGN KEY ("bank_connection_id") REFERENCES "public"."bank_connections"("id") ON DELETE cascade ON UPDATE no action;