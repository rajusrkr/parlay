CREATE TABLE "user-session" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(36),
	"session_for" integer,
	"is_session_active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user-session" ADD CONSTRAINT "user-session_session_for_users_id_fk" FOREIGN KEY ("session_for") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;