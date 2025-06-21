ALTER TABLE "priceData" DROP CONSTRAINT "priceData_marketId_markets_market_id_fk";
--> statement-breakpoint
ALTER TABLE "priceData" ADD CONSTRAINT "priceData_marketId_markets_market_id_fk" FOREIGN KEY ("marketId") REFERENCES "public"."markets"("market_id") ON DELETE cascade ON UPDATE no action;