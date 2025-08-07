ALTER TABLE "bank_connections" ALTER COLUMN "requisition_creation_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "bank_connections" ALTER COLUMN "requisition_creation_date" DROP NOT NULL;