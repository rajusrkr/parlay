CREATE TABLE "price" (
	"id" serial PRIMARY KEY NOT NULL,
	"market_id" varchar(36),
	"outcomes_and_prices" jsonb NOT NULL,
	"created_at" bigint
);
--> statement-breakpoint
ALTER TABLE "price" ADD CONSTRAINT "price_market_id_market_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("market_id") ON DELETE no action ON UPDATE no action;