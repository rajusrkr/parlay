ALTER TABLE "market" ALTER COLUMN "market_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."market_type";--> statement-breakpoint
CREATE TYPE "public"."market_type" AS ENUM('binary', 'other');--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "market_type" SET DATA TYPE "public"."market_type" USING "market_type"::"public"."market_type";