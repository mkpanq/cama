ALTER TABLE "balances" ALTER COLUMN "reference_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "balances" ALTER COLUMN "reference_date" DROP NOT NULL;