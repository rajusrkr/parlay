CREATE TYPE "public"."market_type" AS ENUM('binary', 'multiple');--> statement-breakpoint
ALTER TABLE "market" ADD COLUMN "market_type" "market_type";