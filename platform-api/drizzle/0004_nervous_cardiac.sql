CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(36) NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"password" varchar(16) NOT NULL,
	"role" "user_role" DEFAULT 'USER',
	"user_balance" numeric(19, 4) DEFAULT '1000.00',
	"currency" "currency_code" DEFAULT 'INR',
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_user_email_unique" UNIQUE("user_email")
);
--> statement-breakpoint
DROP TABLE "user" CASCADE;