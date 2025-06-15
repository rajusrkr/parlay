CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"market_id" varchar(36),
	"price" integer NOT NULL,
	"qty" integer NOT NULL,
	"side_taken" varchar(3) NOT NULL,
	"order_placed_by" varchar(36) NOT NULL,
	"created_on" timestamp DEFAULT now(),
	"updated_on" timestamp
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_market_id_markets_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("market_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_placed_by_users_user_id_fk" FOREIGN KEY ("order_placed_by") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;