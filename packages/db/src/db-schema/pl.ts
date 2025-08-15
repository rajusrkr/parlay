import { decimal, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { market } from "./market";
import { user } from "./user";

const pl = pgTable("pl", {
    id: serial("pl").primaryKey(),

    // Market details and User details
    marketId: varchar("market_id", { length: 36 }).references(() => market.marketId).notNull(),
    userId: varchar("user_id", { length: 36 }).references(() => user.userId).notNull(),

    // PL details
    plOutcome: text("pl_outcome").notNull(),
    netPL: decimal("net_pl", { precision: 12, scale: 2 }).notNull(),

    // Timestamp
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})

export { pl }