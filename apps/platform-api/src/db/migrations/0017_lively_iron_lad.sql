ALTER TABLE "markets" ADD COLUMN "last_updated_yes_price" numeric(19, 4);--> statement-breakpoint
ALTER TABLE "markets" ADD COLUMN "last_updated_no_price" numeric(19, 4);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "yes_price_after_order" numeric(19, 4);--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "no_price_after_order" numeric(19, 4);