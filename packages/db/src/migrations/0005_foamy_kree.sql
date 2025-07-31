CREATE TYPE "public"."market_category" AS ENUM('SPORTS', 'CRYPTO', 'POLITICS');--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "marketCategory" "market_category";