import { bigint, jsonb, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { admin } from "./admin";
import {type Outcome} from "@repo/types/src/index"

export const CurrentMarketStatus = pgEnum("current_status", ["open_soon", "open", "settled", "cancelled"]);
export const MarketCategory = pgEnum("market_category", ["sports", "crypto", "politics", "regular"]);

const market = pgTable("market", {
    // Market identity
    id: serial("id").primaryKey(),
    marketId: varchar("market_id", { length: 36 }).unique().notNull(),

    // Market creater identity
    marketCreatedBy: varchar("market_created_by", { length: 36 }).references(() => admin.adminId, { onDelete: "cascade" }).notNull(),


    // Market details
    title: varchar("market_title", { length: 255 }).notNull(),
    description: text("market_overview").notNull(),
    settlement: text("market_settlement").notNull(),
    currentStatus: CurrentMarketStatus("current_status").default("open_soon"),
    marketCategory: MarketCategory("market_category").notNull(),

    // Timing
    marketStarts: bigint("market_starts", { mode: "number" }).notNull(),
    marketEnds: bigint("market_ends", { mode: "number" }).notNull(),

    // Outcome and prices, will store latest prices
    outcomes: jsonb("outcome_and_price").$type<Outcome[]>().notNull(),


    // Winner
    winnerSide: jsonb("winner"),


    // Timestamp
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})


export { market }