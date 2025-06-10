import { boolean, decimal, integer, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const UserRole = pgEnum("user_role", ["USER", "ADMIN"])
export const CurrencyCode = pgEnum("currency_code", ["INR", "USD"])

// USER TABLE
export const user = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 36}).notNull(),
    userId: varchar("user_id", {length: 36}).notNull().unique(),
    userEmail: varchar("user_email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 16}).notNull(),
    role: UserRole().default("USER"), 
    userAccountBalance: decimal("user_balance", {precision: 19, scale: 4}).default("1000.00"),
    currency: CurrencyCode().default("INR"),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())    
})

// USER SESSION MANAGE TABLE
export const usersSessions = pgTable("usersSessions", {
    id: serial("id").primaryKey(),
    sessionId: varchar("session_id", {length: 36}),
    sessionFor: integer("session_for").references(() => user.id, {onDelete: "cascade"}),
    isSessionActive: boolean("is_session_active").default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})