import { bigint, decimal, integer, jsonb, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { market } from "./market";

export const OrderType = pgEnum("order_type", ["buy", "sell"])

const order = pgTable("order", {
    // Order Identity
    id: serial("id").primaryKey(),
    orderId: varchar("order_id", { length: 36 }).notNull(),


    // User Identity
    orderPlacedBy: varchar("order_palced_by", { length: 36 }).references(() => user.userId, { onDelete: "cascade" }).notNull(),


    // Order details
    orderTakenIn: varchar("order_taken_id", { length: 36 }).references(() => market.marketId, { onDelete: "cascade" }).notNull(),
    orderPlacedFor: varchar("order_plced_for", { length: 12 }), // order outcome
    orderType: OrderType().notNull(), // buy or sell
    orderQty: integer("order_qty").notNull(),
    averageTradedPrice: decimal("average_traded_price", {precision: 12, scale: 2}),

    // New updated price, will be used as price data
    updatedPrices: jsonb("updated_prices").notNull(),


    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})


export { order }