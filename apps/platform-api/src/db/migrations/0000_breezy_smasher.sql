CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."currency_code" AS ENUM('INR', 'USD');--> statement-breakpoint
CREATE TYPE "public"."current_status" AS ENUM('NOT_STARTED', 'OPEN', 'SETTLED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(26) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(120),
	"is_account_verified" boolean DEFAULT true,
	"admin_id" varchar(36) NOT NULL,
	"role" "role" DEFAULT 'ADMIN',
	"created_on" timestamp DEFAULT now(),
	"updated_on)" timestamp,
	CONSTRAINT "admins_email_unique" UNIQUE("email"),
	CONSTRAINT "admins_admin_id_unique" UNIQUE("admin_id")
);
--> statement-breakpoint
CREATE TABLE "combine_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"market_id" varchar(36) NOT NULL,
	"side" varchar(4) NOT NULL,
	"total_qty" integer NOT NULL,
	"avg_price" numeric(19, 2) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "markets" (
	"id" serial PRIMARY KEY NOT NULL,
	"market_id" varchar(36) NOT NULL,
	"market_title" varchar(120) NOT NULL,
	"yes_side" varchar(20) NOT NULL,
	"no_side" varchar(20) NOT NULL,
	"market_start" timestamp NOT NULL,
	"market_ends" timestamp NOT NULL,
	"currentStatus" "current_status" DEFAULT 'NOT_STARTED',
	"winner_side" varchar(20),
	"total_yes_qty" integer DEFAULT 500000 NOT NULL,
	"total_No_qty" integer DEFAULT 500000 NOT NULL,
	"last_updated_yes_price" numeric(19, 2),
	"last_updated_no_price" numeric(19, 2),
	"market_created_by" varchar(36) NOT NULL,
	"created_on" timestamp DEFAULT now(),
	"updatedOn" timestamp,
	CONSTRAINT "markets_market_id_unique" UNIQUE("market_id"),
	CONSTRAINT "markets_market_title_unique" UNIQUE("market_title")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"market_id" varchar(36),
	"price" numeric(19, 2) NOT NULL,
	"qty" integer NOT NULL,
	"side_taken" varchar(3) NOT NULL,
	"order_type" varchar(36),
	"order_placed_by" varchar(36) NOT NULL,
	"yes_price_after_order" numeric(19, 2),
	"no_price_after_order" numeric(19, 2),
	"created_on" timestamp DEFAULT now(),
	"updated_on" timestamp
);
--> statement-breakpoint
CREATE TABLE "priceData" (
	"id" serial PRIMARY KEY NOT NULL,
	"marketId" varchar(36),
	"yes_price" numeric(19, 2) NOT NULL,
	"no_price" numeric(19, 2) NOT NULL,
	"price_updated_on" bigint,
	CONSTRAINT "yes_check" CHECK ("priceData"."yes_price" >=0.00 AND "priceData"."yes_price" <=1.00),
	CONSTRAINT "no_check" CHECK ("priceData"."no_price" >=0.00 AND "priceData"."no_price" <=1.00),
	CONSTRAINT "both_side_combined" CHECK ("priceData"."yes_price" + "priceData"."no_price" <=1.00)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(26) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(120),
	"is_account_verified" boolean DEFAULT true,
	"user_id" varchar(36) NOT NULL,
	"role" "role" DEFAULT 'USER',
	"wallet_balance" integer DEFAULT 1000,
	"currencyCode" "currency_code" DEFAULT 'INR',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "combine_order" ADD CONSTRAINT "combine_order_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "combine_order" ADD CONSTRAINT "combine_order_market_id_markets_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("market_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "markets" ADD CONSTRAINT "markets_market_created_by_admins_admin_id_fk" FOREIGN KEY ("market_created_by") REFERENCES "public"."admins"("admin_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_market_id_markets_market_id_fk" FOREIGN KEY ("market_id") REFERENCES "public"."markets"("market_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_placed_by_users_user_id_fk" FOREIGN KEY ("order_placed_by") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "priceData" ADD CONSTRAINT "priceData_marketId_markets_market_id_fk" FOREIGN KEY ("marketId") REFERENCES "public"."markets"("market_id") ON DELETE cascade ON UPDATE no action;