ALTER TABLE "user-session" RENAME TO "users-sessions";--> statement-breakpoint
ALTER TABLE "users-sessions" DROP CONSTRAINT "user-session_session_for_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users-sessions" ADD CONSTRAINT "users-sessions_session_for_users_id_fk" FOREIGN KEY ("session_for") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;