ALTER TABLE "order" ALTER COLUMN "average_traded_price" SET DATA TYPE numeric(12, 4);--> statement-breakpoint
ALTER TABLE "position" ALTER COLUMN "pnL" SET DATA TYPE numeric(12, 4);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "wallet_balance" SET DATA TYPE numeric(12, 4);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "wallet_balance" SET DEFAULT 50000;