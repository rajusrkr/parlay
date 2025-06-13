CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."currency_code" AS ENUM('INR', 'USD');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(26) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(36),
	"is_account_verified" boolean DEFAULT true,
	"user_id" varchar(36) NOT NULL,
	"role" "role" DEFAULT 'USER',
	"user_wallet_balance" numeric(19, 4) DEFAULT '1000.0000',
	"currencyCode" "currency_code" DEFAULT 'INR',
	"account_created_on" timestamp DEFAULT now(),
	"account_updated_on)" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id")
);
