ALTER TABLE "pl" DROP CONSTRAINT "pl_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "position" DROP CONSTRAINT "position_position_taken_in_market_market_id_fk";
--> statement-breakpoint
ALTER TABLE "pl" ADD CONSTRAINT "pl_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "position" ADD CONSTRAINT "position_position_taken_in_market_market_id_fk" FOREIGN KEY ("position_taken_in") REFERENCES "public"."market"("market_id") ON DELETE cascade ON UPDATE no action;