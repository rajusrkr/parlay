ALTER TABLE "markets" ALTER COLUMN "last_updated_yes_price" SET DATA TYPE numeric(19, 2);--> statement-breakpoint
ALTER TABLE "markets" ALTER COLUMN "last_updated_no_price" SET DATA TYPE numeric(19, 2);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "price" SET DATA TYPE numeric(19, 2);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "yes_price_after_order" SET DATA TYPE numeric(19, 2);--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "no_price_after_order" SET DATA TYPE numeric(19, 2);--> statement-breakpoint
ALTER TABLE "priceData" ALTER COLUMN "yes_price" SET DATA TYPE numeric(19, 2);--> statement-breakpoint
ALTER TABLE "priceData" ALTER COLUMN "no_price" SET DATA TYPE numeric(19, 2);