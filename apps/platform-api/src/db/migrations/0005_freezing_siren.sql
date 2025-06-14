ALTER TABLE "markets" ALTER COLUMN "currentStatus" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "markets" ALTER COLUMN "currentStatus" SET DEFAULT 'NOT_STARTED'::text;--> statement-breakpoint
DROP TYPE "public"."current_status";--> statement-breakpoint
CREATE TYPE "public"."current_status" AS ENUM('NOT_STARTED', 'OPEN', 'SETTLED', 'CANCELLED');--> statement-breakpoint
ALTER TABLE "markets" ALTER COLUMN "currentStatus" SET DEFAULT 'NOT_STARTED'::"public"."current_status";--> statement-breakpoint
ALTER TABLE "markets" ALTER COLUMN "currentStatus" SET DATA TYPE "public"."current_status" USING "currentStatus"::"public"."current_status";--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "market_created_by" varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE "markets" ADD CONSTRAINT "markets_market_created_by_admins_admin_id_fk" FOREIGN KEY ("market_created_by") REFERENCES "public"."admins"("admin_id") ON DELETE no action ON UPDATE no action;