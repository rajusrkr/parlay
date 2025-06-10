ALTER TABLE "users-sessions" RENAME TO "usersSessions";--> statement-breakpoint
ALTER TABLE "usersSessions" DROP CONSTRAINT "users-sessions_session_for_users_id_fk";
--> statement-breakpoint
ALTER TABLE "usersSessions" ADD CONSTRAINT "usersSessions_session_for_users_id_fk" FOREIGN KEY ("session_for") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;