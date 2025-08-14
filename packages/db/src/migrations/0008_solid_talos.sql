ALTER TABLE "user" ALTER COLUMN "wallet_balance" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "wallet_balance" SET DEFAULT '50000.00';