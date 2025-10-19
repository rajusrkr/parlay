DROP TABLE "pl" CASCADE;--> statement-breakpoint
DROP TABLE "price" CASCADE;--> statement-breakpoint
ALTER TABLE "position" ADD COLUMN "pnL" numeric(12, 2);