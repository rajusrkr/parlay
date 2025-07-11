ALTER TABLE "combine_order" DROP CONSTRAINT "combine_order_market_id_markets_market_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "wallet_balance" integer DEFAULT 1000;--> statement-breakpoint
ALTER TABLE "combine_order" ADD CONSTRAINT "combine_order_market_id_markets_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("market_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "user_wallet_balance";