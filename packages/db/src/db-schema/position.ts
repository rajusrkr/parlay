import { boolean, jsonb, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { market } from "./market";

interface TotalQtyAndAvgPrice {
    totalQty: number,
    avgPrice: string
    atTotalCost: string,
}

const position = pgTable("position", {
    // Position identity
    id: serial("id").primaryKey(),
    positionId: varchar("position_id", { length: 36 }).unique().notNull(),


    // User Identity
    positionTakenBy: varchar("position_taken_by", { length: 36 }).references(() => user.userId, { onDelete: "cascade" }).notNull(),


    // Position details
    positionTakenIn: varchar("position_taken_in", { length: 36 }).references(() => market.marketId).notNull(),
    positionTakenFor: varchar("position_taken_for", { length: 12 }).notNull(),
    totalQtyAndAvgPrice: jsonb("total_qty_&_avg_price").$type<TotalQtyAndAvgPrice>().notNull(),
    isPositionSettled: boolean("is_position_settles").default(false),


    // Timestamp
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})

export { position }

