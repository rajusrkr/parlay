import { bigint, integer, jsonb, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";

export const OrderType = pgEnum("order_type", ["buy", "sell"])

const order = pgTable("order",{
    // Order Identity
    id: serial("id").primaryKey(),
    orderId: varchar("order_id", {length: 36}).notNull(),
    
    
    // User Identity
    orderPlacedBy: varchar("order_palced_by", {length: 36}).references(() => user.userId, {onDelete: "cascade"}),
    
    
    // Order details
    orderTakenIn: varchar("order_taken_id", {length: 36}), // the market id
    orderPlacedFor: varchar("order_plced_for", {length: 12}), // order outcome
    orderType: OrderType().notNull(), // buy or sell
    orderQty: integer("order_qty").notNull(),

    // New updated price, will be used as price data
    updatedPrices: jsonb("updated_prices"),


    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})


export { order }