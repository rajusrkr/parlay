import { jsonb, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

const position = pgTable("position", {
    // Position identity
    id: serial("id").primaryKey(),
    positionId: varchar("position_id", {length: 36}).notNull(),


    // User Identity
    positionTakenBy: varchar("position_taken_by", {length: 36}).notNull(),


    // Position details
    positionTakenIn: varchar("position_taken_in", {length: 36}),
    positionTakenFor: varchar("position_taken_for", {length: 12}).notNull(),
    totalQtyAndAvgPrice: jsonb("total_qty_&_avg_price"),


    // Timestamp
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})

export { position }

