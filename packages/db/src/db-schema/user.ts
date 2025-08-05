import { boolean, integer, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const AccountRole = pgEnum("account_role", ["USER", "ADMIN"])
export const CurrencyCode = pgEnum("currency_code", ["INR", "USD"])

const user = pgTable("user", {
    // Identity
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 36}).notNull(),
    email: varchar("email", {length: 255}).unique().notNull(),
    userId: varchar("user_id", {length: 36}).unique().notNull(),
    role: AccountRole().default("USER"),

    // Security
    password: varchar("password", {length: 120}).notNull(),
    isVerified: boolean("is_verified").default(true), // Later flag this false


    // Wallet & Balance
    walletBalance: integer("wallet_balance").default(50000),
    currencyCode: CurrencyCode().default("USD"),

    
    // Timestamp
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
})

export { user }