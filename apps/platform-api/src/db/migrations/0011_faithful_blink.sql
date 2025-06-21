ALTER TABLE "markets" DROP CONSTRAINT "markets_market_created_by_admins_admin_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_market_id_markets_market_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_order_placed_by_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "markets" ADD CONSTRAINT "markets_market_created_by_admins_admin_id_fk" FOREIGN KEY ("market_created_by") REFERENCES "public"."admins"("admin_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_market_id_markets_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("market_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_placed_by_users_user_id_fk" FOREIGN KEY ("order_placed_by") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;