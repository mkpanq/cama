ALTER TABLE "accounts" ALTER COLUMN "currency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "institution_resource_id";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "product";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "cash_account_type";