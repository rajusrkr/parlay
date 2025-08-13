ALTER TABLE "market" ALTER COLUMN "currentStatus" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "currentStatus" SET DEFAULT 'not_started'::text;--> statement-breakpoint
DROP TYPE "public"."current_status";--> statement-breakpoint
CREATE TYPE "public"."current_status" AS ENUM('not_started', 'open', 'settled', 'cancelled');--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "currentStatus" SET DEFAULT 'not_started'::"public"."current_status";--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "currentStatus" SET DATA TYPE "public"."current_status" USING "currentStatus"::"public"."current_status";--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "marketCategory" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."market_category";--> statement-breakpoint
CREATE TYPE "public"."market_category" AS ENUM('sports', 'crypto', 'politics');--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "marketCategory" SET DATA TYPE "public"."market_category" USING "marketCategory"::"public"."market_category";