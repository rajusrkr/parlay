import {
  decimal,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { market } from "./market";

interface TotalQtyAndAvgPrice {
  totalQty: number;
  avgPrice: number;
  atTotalCost: number;
}

const position = pgTable("position", {
  // Position identity
  id: uuid("id").primaryKey().defaultRandom(),

  // User Identity
  positionTakenBy: uuid("position_taken_by")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  // Position details
  positionTakenIn: uuid("position_taken_in")
    .references(() => market.id, { onDelete: "cascade" })
    .notNull(), // Market id
  positionTakenFor: varchar("position_taken_for", { length: 255 }).notNull(), // Selected outcome
  totalQtyAndAvgPrice: jsonb("total_qty_&_avg_price")
    .$type<TotalQtyAndAvgPrice>()
    .notNull(),

  // PnL
  pnL: decimal("pnL", { precision: 12, scale: 4, mode: "number" }),

  // Timestamp
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export { position };
