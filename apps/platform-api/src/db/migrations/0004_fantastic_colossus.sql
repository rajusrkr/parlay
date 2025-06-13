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
