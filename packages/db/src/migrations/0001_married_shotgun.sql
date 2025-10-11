ALTER TABLE "market" ALTER COLUMN "current_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "current_status" SET DEFAULT 'open_soon'::text;--> statement-breakpoint
DROP TYPE "public"."current_status";--> statement-breakpoint
CREATE TYPE "public"."current_status" AS ENUM('open_soon', 'open', 'settled', 'cancelled');--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "current_status" SET DEFAULT 'open_soon'::"public"."current_status";--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "current_status" SET DATA TYPE "public"."current_status" USING "current_status"::"public"."current_status";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "currencyCode" SET DEFAULT 'INR';--> statement-breakpoint
ALTER TABLE "market" DROP COLUMN "market_type";--> statement-breakpoint
ALTER TABLE "market" DROP COLUMN "market_thumbnail_image_url";--> statement-breakpoint
DROP TYPE "public"."market_type";