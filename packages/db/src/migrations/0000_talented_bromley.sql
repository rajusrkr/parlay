CREATE TYPE "public"."category" AS ENUM('sports', 'crypto');--> statement-breakpoint
CREATE TYPE "public"."market_state" AS ENUM('open', 'not_started', 'resolved', 'resolving', 'new_order_stoped');--> statement-breakpoint
CREATE TYPE "public"."order_type" AS ENUM('buy', 'sell');--> statement-breakpoint
CREATE TYPE "public"."account_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."currency_code" AS ENUM('INR', 'USD');--> statement-breakpoint
CREATE TABLE "admin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(26) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(120),
	"role" "account_role" DEFAULT 'ADMIN',
	"created_at" timestamp DEFAULT now(),
	"updated_at)" timestamp,
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "category_crypto" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"crypto_interval" text NOT NULL,
	"crypto_coin_name" text NOT NULL,
	"market_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "category_sports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matchId" text NOT NULL,
	"match_starts" bigint NOT NULL,
	"match_ends" bigint,
	"market_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "market" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"settlement_rules" text NOT NULL,
	"category" "category" NOT NULL,
	"outcomes" jsonb NOT NULL,
	"market_starts" bigint NOT NULL,
	"market_ends" bigint,
	"resolution" text,
	"market_state" "market_state" DEFAULT 'not_started' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_palced_by" uuid NOT NULL,
	"order_taken_id" uuid NOT NULL,
	"order_plced_for" varchar(255),
	"orderType" "order_type" NOT NULL,
	"order_qty" integer NOT NULL,
	"average_traded_price" numeric(12, 4),
	"updated_prices" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "position" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position_taken_by" uuid NOT NULL,
	"position_taken_in" uuid NOT NULL,
	"position_taken_for" varchar(255) NOT NULL,
	"total_qty_&_avg_price" jsonb NOT NULL,
	"pnL" numeric(12, 4),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(36) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "account_role" DEFAULT 'USER',
	"password" varchar(120) NOT NULL,
	"is_verified" boolean DEFAULT true,
	"wallet_balance" numeric(12, 4) DEFAULT 50000 NOT NULL,
	"currencyCode" "currency_code" DEFAULT 'INR',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "category_crypto" ADD CONSTRAINT "category_crypto_market_id_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_sports" ADD CONSTRAINT "category_sports_market_id_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."market"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market" ADD CONSTRAINT "market_created_by_admin_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_order_palced_by_user_id_fk" FOREIGN KEY ("order_palced_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_order_taken_id_market_id_fk" FOREIGN KEY ("order_taken_id") REFERENCES "public"."market"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_taken_by_user_id_fk" FOREIGN KEY ("position_taken_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_taken_in_market_id_fk" FOREIGN KEY ("position_taken_in") REFERENCES "public"."market"("id") ON DELETE cascade ON UPDATE no action;