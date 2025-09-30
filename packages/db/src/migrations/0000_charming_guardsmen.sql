CREATE TYPE "public"."current_status" AS ENUM('not_started', 'open', 'settled', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."market_category" AS ENUM('sports', 'crypto', 'politics', 'regular');--> statement-breakpoint
CREATE TYPE "public"."market_type" AS ENUM('binary', 'other');--> statement-breakpoint
CREATE TYPE "public"."order_type" AS ENUM('buy', 'sell');--> statement-breakpoint
CREATE TYPE "public"."account_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."currency_code" AS ENUM('INR', 'USD');--> statement-breakpoint
CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" varchar(36) NOT NULL,
	"name" varchar(26) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(120),
	"role" "account_role" DEFAULT 'ADMIN',
	"created_at" timestamp DEFAULT now(),
	"updated_at)" timestamp,
	CONSTRAINT "admin_admin_id_unique" UNIQUE("admin_id"),
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "market" (
	"id" serial PRIMARY KEY NOT NULL,
	"market_id" varchar(36) NOT NULL,
	"market_created_by" varchar(36) NOT NULL,
	"market_title" varchar(255) NOT NULL,
	"market_overview" text NOT NULL,
	"market_settlement" text NOT NULL,
	"current_status" "current_status" DEFAULT 'not_started',
	"market_category" "market_category",
	"market_type" "market_type",
	"market_thumbnail_image_url" text NOT NULL,
	"market_starts" bigint NOT NULL,
	"market_ends" bigint NOT NULL,
	"outcome_and_price" jsonb NOT NULL,
	"winner" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "market_market_id_unique" UNIQUE("market_id")
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"order_palced_by" varchar(36) NOT NULL,
	"order_taken_id" varchar(36) NOT NULL,
	"order_plced_for" varchar(12),
	"orderType" "order_type" NOT NULL,
	"order_qty" integer NOT NULL,
	"average_traded_price" numeric(12, 2),
	"updated_prices" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
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
CREATE TABLE "position" (
	"id" serial PRIMARY KEY NOT NULL,
	"position_id" varchar(36) NOT NULL,
	"position_taken_by" varchar(36) NOT NULL,
	"position_taken_in" varchar(36) NOT NULL,
	"position_taken_for" varchar(12) NOT NULL,
	"total_qty_&_avg_price" jsonb NOT NULL,
	"is_position_settles" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "position_position_id_unique" UNIQUE("position_id")
);
--> statement-breakpoint
CREATE TABLE "price" (
	"id" serial PRIMARY KEY NOT NULL,
	"market_id" varchar(36) NOT NULL,
	"outcomes_and_prices" jsonb NOT NULL,
	"created_at" bigint
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(36) NOT NULL,
	"email" varchar(255) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"role" "account_role" DEFAULT 'USER',
	"password" varchar(120) NOT NULL,
	"is_verified" boolean DEFAULT true,
	"wallet_balance" numeric(12, 2) DEFAULT '50000.00',
	"currencyCode" "currency_code" DEFAULT 'USD',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "market" ADD CONSTRAINT "market_market_created_by_admin_admin_id_fk" FOREIGN KEY ("market_created_by") REFERENCES "public"."admin"("admin_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_order_palced_by_user_user_id_fk" FOREIGN KEY ("order_palced_by") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_order_taken_id_market_market_id_fk" FOREIGN KEY ("order_taken_id") REFERENCES "public"."market"("market_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pl" ADD CONSTRAINT "pl_market_id_market_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("market_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pl" ADD CONSTRAINT "pl_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_taken_by_user_user_id_fk" FOREIGN KEY ("position_taken_by") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_taken_in_market_market_id_fk" FOREIGN KEY ("position_taken_in") REFERENCES "public"."market"("market_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price" ADD CONSTRAINT "price_market_id_market_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("market_id") ON DELETE cascade ON UPDATE no action;