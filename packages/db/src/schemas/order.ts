import { decimal, integer, jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { market } from "./market";

export const OrderType = pgEnum("order_type", ["buy", "sell"])

const order = pgTable("order", {
    // Order Identity
    id: uuid("id").primaryKey().defaultRandom(),

    // User Identity
    orderPlacedBy: uuid("order_palced_by").references(() => user.id, { onDelete: "cascade" }).notNull(),


    // Order details
    orderTakenIn: uuid("order_taken_id").references(() => market.id, { onDelete: "cascade" }).notNull(),
    orderPlacedFor: varchar("order_plced_for", { length: 255 }), // order outcome
    orderType: OrderType().notNull(), // buy or sell
    orderQty: integer("order_qty").notNull(),
    averageTradedPrice: decimal("average_traded_price", { precision: 12, scale: 4, mode: "number" }),

    // New updated price, will be used as price data
    updatedPrices: jsonb("updated_prices").notNull(),


    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})


export { order }