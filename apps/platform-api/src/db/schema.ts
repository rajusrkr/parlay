import { boolean, decimal, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const AccountRoleEnum = pgEnum("role", ["USER", "ADMIN"])
export const CurrencyCode = pgEnum("currency_code", ["INR", "USD"])

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 26}).notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 120}),
    isAccountVerified: boolean("is_account_verified").default(true),
    userId: varchar("user_id", {length: 36}).notNull().unique(),
    role: AccountRoleEnum().default("USER"),
    userWalletBalance: decimal("user_wallet_balance", {precision: 19, scale:4}).default("1000.0000"),
    currencyCode: CurrencyCode().default("INR"),
    accountCreatedOn: timestamp("account_created_on").defaultNow(),
    accountUpdatedOn: timestamp("account_updated_on)").$onUpdate(() => new Date())
})

export const CurrentMarketStatus = pgEnum("current_status", ["CLOSED", "OPEN", "SETTLED"])

export const marketTable = pgTable("markets", {
    id: serial("id").primaryKey(),
    marketId: varchar("market_id", {length: 36}).notNull().unique(),
    marketTitle: varchar("market_title", {length: 120}).notNull(),
    side1: varchar("side_1", {length: 20}).notNull(),
    side2: varchar("side_2", {length: 20}).notNull(),
    marketStarts: timestamp("market_start").notNull(),
    marketEnds: timestamp("market_ends").notNull(),
    currentStatus: CurrentMarketStatus().default("CLOSED"),
    winnerSide: varchar("winner_side", {length: 20}),
    createdOn: timestamp("created_on").defaultNow(),
    updatedOn: timestamp().$onUpdate(() => new Date())
})