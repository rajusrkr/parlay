ALTER TABLE "price" DROP CONSTRAINT "price_market_id_market_market_id_fk";
--> statement-breakpoint
ALTER TABLE "market" ALTER COLUMN "market_created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "order_palced_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "order_taken_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "updated_prices" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "position_taken_in" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "total_qty_&_avg_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "price" ALTER COLUMN "market_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "market" ADD CONSTRAINT "market_market_created_by_admin_admin_id_fk" FOREIGN KEY ("market_created_by") REFERENCES "public"."admin"("admin_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_order_taken_id_market_market_id_fk" FOREIGN KEY ("order_taken_id") REFERENCES "public"."market"("market_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_taken_by_user_user_id_fk" FOREIGN KEY ("position_taken_by") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_taken_in_market_market_id_fk" FOREIGN KEY ("position_taken_in") REFERENCES "public"."market"("market_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price" ADD CONSTRAINT "price_market_id_market_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("market_id") ON DELETE cascade ON UPDATE no action;