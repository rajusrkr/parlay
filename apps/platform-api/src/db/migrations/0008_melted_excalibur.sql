CREATE TABLE "priceData" (
	"id" serial PRIMARY KEY NOT NULL,
	"marketId" varchar(36),
	"yes_price" integer NOT NULL,
	"no_price" integer NOT NULL,
	"created_on" timestamp DEFAULT now(),
	"updated_on" timestamp,
	CONSTRAINT "yes_check" CHECK ("priceData"."yes_price" >=1 AND "priceData"."yes_price" <=99),
	CONSTRAINT "no_check" CHECK ("priceData"."no_price" >=1 AND "priceData"."no_price" <=99),
	CONSTRAINT "both_side_combined" CHECK ("priceData"."yes_price" + "priceData"."no_price" <=100)
);
--> statement-breakpoint
ALTER TABLE "priceData" ADD CONSTRAINT "priceData_marketId_markets_market_id_fk" FOREIGN KEY ("marketId") REFERENCES "public"."markets"("market_id") ON DELETE no action ON UPDATE no action;