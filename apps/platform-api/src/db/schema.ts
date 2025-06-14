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
    createdOn: timestamp("created_on").defaultNow(),
    updatedOn: timestamp("updated_on)").$onUpdate(() => new Date())
})

export const CurrentMarketStatus = pgEnum("current_status", ["NOT_STARTED", "OPEN", "SETTLED", "CANCELLED"])

export const marketTable = pgTable("markets", {
    id: serial("id").primaryKey(),
    marketId: varchar("market_id", {length: 36}).notNull().unique(),
    marketTitle: varchar("market_title", {length: 120}).notNull(),
    side1: varchar("side_1", {length: 20}).notNull(),
    side2: varchar("side_2", {length: 20}).notNull(),
    marketStarts: timestamp("market_start").notNull(),
    marketEnds: timestamp("market_ends").notNull(),
    currentStatus: CurrentMarketStatus().default("NOT_STARTED"),
    winnerSide: varchar("winner_side", {length: 20}),
    marketCreatedBy: varchar("market_created_by", {length: 36}).references(() => adminsTable.adminId).notNull(),
    createdOn: timestamp("created_on").defaultNow(),
    updatedOn: timestamp().$onUpdate(() => new Date())
})




// ADMIN
export const adminsTable = pgTable("admins", {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 26}).notNull(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 120}),
    isAccountVerified: boolean("is_account_verified").default(true),
    adminId: varchar("admin_id", {length: 36}).notNull().unique(),
    role: AccountRoleEnum().default("ADMIN"),
    createdOn: timestamp("created_on").defaultNow(),
    updatedOn: timestamp("updated_on)").$onUpdate(() => new Date())
})