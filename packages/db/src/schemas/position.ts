import { boolean, decimal, jsonb, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
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
    positionTakenIn: varchar("position_taken_in", { length: 36 }).references(() => market.marketId, { onDelete: "cascade" }).notNull(), // Market id
    positionTakenFor: varchar("position_taken_for", { length: 255 }).notNull(), // Selected outcome
    totalQtyAndAvgPrice: jsonb("total_qty_&_avg_price").$type<TotalQtyAndAvgPrice>().notNull(),
    isPositionSettled: boolean("is_position_settles").default(false),

    // PnL
    pnL: decimal("pnL", { precision: 12, scale: 4, mode: "number" }),


    // Timestamp
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})

export { position }

