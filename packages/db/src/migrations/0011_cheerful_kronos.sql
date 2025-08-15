CREATE TABLE "pl" (
	"pl" serial PRIMARY KEY NOT NULL,
	"market_id" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"pl_outcome" text NOT NULL,
	"net_pl" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "pl" ADD CONSTRAINT "pl_market_id_market_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("market_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pl" ADD CONSTRAINT "pl_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;