ALTER TABLE "priceData" DROP CONSTRAINT "yes_check";--> statement-breakpoint
ALTER TABLE "priceData" DROP CONSTRAINT "no_check";--> statement-breakpoint
ALTER TABLE "priceData" DROP CONSTRAINT "both_side_combined";--> statement-breakpoint
ALTER TABLE "markets" ALTER COLUMN "total_yes_qty" SET DEFAULT 500000;--> statement-breakpoint
ALTER TABLE "markets" ALTER COLUMN "total_No_qty" SET DEFAULT 500000;--> statement-breakpoint
ALTER TABLE "priceData" ADD CONSTRAINT "yes_check" CHECK ("priceData"."yes_price" >=0.00 AND "priceData"."yes_price" <=1.00);--> statement-breakpoint
ALTER TABLE "priceData" ADD CONSTRAINT "no_check" CHECK ("priceData"."no_price" >=0.00 AND "priceData"."no_price" <=1.00);--> statement-breakpoint
ALTER TABLE "priceData" ADD CONSTRAINT "both_side_combined" CHECK ("priceData"."yes_price" + "priceData"."no_price" <=1.00);