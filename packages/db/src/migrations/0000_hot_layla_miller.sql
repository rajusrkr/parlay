CREATE TYPE "public"."current_status" AS ENUM('NOT_STARTED', 'OPEN', 'SETTLED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."market_category" AS ENUM('SPORTS', 'CRYPTO', 'POLITICS');--> statement-breakpoint
CREATE TYPE "public"."order_type" AS ENUM('BUY', 'SELL');--> statement-breakpoint
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
	"market_created_by" varchar(36),
	"market_title" varchar(255) NOT NULL,
	"market_overview" text,
	"market_settlement" text,
	"currentStatus" "current_status" DEFAULT 'NOT_STARTED',
	"marketCategory" "market_category",
	"market_thumbnail_image_url" text,
	"market_starts" bigint NOT NULL,
	"market_ends" bigint NOT NULL,
	"outcome_&_price" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"order_palced_by" varchar(36),
	"order_taken_id" varchar(36),
	"order_plced_for" varchar(12),
	"orderType" "order_type" NOT NULL,
	"order_qty" integer NOT NULL,
	"updated_prices" jsonb,
	"created_at" bigint
);
--> statement-breakpoint
CREATE TABLE "position" (
	"id" serial PRIMARY KEY NOT NULL,
	"position_id" varchar(36) NOT NULL,
	"position_taken_by" varchar(36) NOT NULL,
	"position_taken_in" varchar(36),
	"position_taken_for" varchar(12) NOT NULL,
	"total_qty_&_avg_price" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
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
	"wallet_balance" integer DEFAULT 50000,
	"currencyCode" "currency_code" DEFAULT 'USD',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "order" ADD CONSTRAINT "order_order_palced_by_user_user_id_fk" FOREIGN KEY ("order_palced_by") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;