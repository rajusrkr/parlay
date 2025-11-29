import { boolean, decimal, integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const AccountRole = pgEnum("account_role", ["USER", "ADMIN"])
export const CurrencyCode = pgEnum("currency_code", ["INR", "USD"])

const user = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 36 }).notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    role: AccountRole().default("USER"),

    password: varchar("password", { length: 120 }).notNull(),
    isVerified: boolean("is_verified").default(true), // Later flag this false


    walletBalance: decimal("wallet_balance", { precision: 12, scale: 4, mode: "number" }).default(50000.0000).notNull(),
    currencyCode: CurrencyCode().default("INR"),


    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
})

export { user }