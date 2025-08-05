import { bigint, integer, jsonb, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";

export const OrderType = pgEnum("order_type", ["BUY", "SELL"])

const order = pgTable("order",{
    // Order Identity
    id: serial("id").primaryKey(),
    orderId: varchar("order_id", {length: 36}).notNull(),
    
    
    // User Identity
    orderPlacedBy: varchar("order_palced_by", {length: 36}).references(() => user.userId, {onDelete: "cascade"}),
    
    
    // Order details
    orderTakenIn: varchar("order_taken_id", {length: 36}),
    orderPlacedFor: varchar("order_plced_for", {length: 12}),
    orderType: OrderType().notNull(),
    orderQty: integer("order_qty").notNull(),

    // New updated price
    updatedPrices: jsonb("updated_prices"),


    // Timestamp, an successfull order can't be modified, so skiping updated_at
    createdAt: bigint("created_at", {mode: "number"}),
})


export { order }