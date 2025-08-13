ALTER TABLE "order" ALTER COLUMN "orderType" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."order_type";--> statement-breakpoint
CREATE TYPE "public"."order_type" AS ENUM('buy', 'sell');--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "orderType" SET DATA TYPE "public"."order_type" USING "orderType"::"public"."order_type";--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "market" ADD CONSTRAINT "market_market_id_unique" UNIQUE("market_id");--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_id_unique" UNIQUE("position_id");