ALTER TABLE "bank_connections" ALTER COLUMN "max_historical_days" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "bank_connections" ADD COLUMN "institution_name" varchar(256);--> statement-breakpoint
ALTER TABLE "bank_connections" ADD COLUMN "institution_logo" varchar(1024);--> statement-breakpoint
ALTER TABLE "bank_connections" DROP COLUMN "valid_for";