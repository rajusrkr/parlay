import { sql } from "drizzle-orm";
import { boolean, check, decimal, integer, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

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
    marketTitle: varchar("market_title", {length: 120}).notNull().unique(),
    yesSide: varchar("yes_side", {length: 20}).notNull(),
    noSide: varchar("no_side", {length: 20}).notNull(),
    marketStarts: timestamp("market_start").notNull(),
    marketEnds: timestamp("market_ends").notNull(),
    currentStatus: CurrentMarketStatus().default("NOT_STARTED"),
    winnerSide: varchar("winner_side", {length: 20}),
    marketCreatedBy: varchar("market_created_by", {length: 36}).references(() => adminsTable.adminId).notNull(),
    createdOn: timestamp("created_on").defaultNow(),
    updatedOn: timestamp().$onUpdate(() => new Date())
})
// i need two table one is for price and another is for order
export const priceData = pgTable("priceData", {
    id: serial("id").primaryKey(),
    marketId: varchar("marketId", {length: 36}).references(() => marketTable.marketId),
    yesSidePrice: integer("yes_price").notNull(),
    noSidePrice: integer("no_price").notNull(),
    createdOn: timestamp("created_on").defaultNow(),
    updatedOn: timestamp("updated_on").$onUpdate(() => new Date())
}, (table) => ({
    yesPriceCheck: check('yes_check', sql`${table.yesSidePrice} >=1 AND ${table.yesSidePrice} <=99`),
    noPriceCheck: check('no_check', sql`${table.noSidePrice} >=1 AND ${table.noSidePrice} <=99`),
    bothSidePriceCombined: check('both_side_combined', sql`${table.yesSidePrice} + ${table.noSidePrice} <=100`)
}))




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