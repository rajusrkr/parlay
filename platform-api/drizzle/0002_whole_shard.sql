CREATE TYPE "public"."currency_code" AS ENUM('INR', 'USD');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'USER',
	"user_balance" numeric(19, 4) DEFAULT '1000.00',
	"currency" "currency_code" DEFAULT 'INR',
	CONSTRAINT "user_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_user_email_unique" UNIQUE("user_email")
);
--> statement-breakpoint
DROP TABLE "test" CASCADE;