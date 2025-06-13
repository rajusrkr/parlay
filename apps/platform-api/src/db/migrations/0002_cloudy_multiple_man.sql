CREATE TYPE "public"."current_status" AS ENUM('CLOSED', 'OPEN', 'SETTLED');--> statement-breakpoint
CREATE TABLE "markets" (
	"id" serial PRIMARY KEY NOT NULL,
	"market_id" varchar(36) NOT NULL,
	"market_title" varchar(120) NOT NULL,
	"side_1" varchar(20) NOT NULL,
	"side_2" varchar(20) NOT NULL,
	"market_start" timestamp NOT NULL,
	"market_ends" timestamp NOT NULL,
	"currentStatus" "current_status" DEFAULT 'CLOSED',
	"winner_side" varchar(20),
	"created_on" timestamp DEFAULT now(),
	"updatedOn" timestamp,
	CONSTRAINT "markets_market_id_unique" UNIQUE("market_id")
);
