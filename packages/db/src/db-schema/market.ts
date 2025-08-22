import { bigint, jsonb, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { admin } from "./admin";

export const CurrentMarketStatus = pgEnum("current_status", ["not_started", "open", "settled", "cancelled"]);
export const MarketCategory = pgEnum("market_category", ["sports", "crypto", "politics", "regular"]);
export const MarketType = pgEnum("market_type", ["binary", "other"])

export interface OutcomeAndPrice {
    outcome: string,
    price: string,
    tradedQty: number
}

const market = pgTable("market", {
    // Market identity
    id: serial("id").primaryKey(),
    marketId: varchar("market_id", { length: 36 }).unique().notNull(),

    // Market creater identity
    marketCreatedBy: varchar("market_created_by", { length: 36 }).references(() => admin.adminId, { onDelete: "cascade" }).notNull(),


    // Market details
    marketTitle: varchar("market_title", { length: 255 }).notNull(),
    marketOverview: text("market_overview").notNull(),
    marketSettlement: text("market_settlement").notNull(),
    currentStatus: CurrentMarketStatus("current_status").default("not_started"),
    marketCategory: MarketCategory("market_category"),
    marketType: MarketType("market_type"),
    thumbnailImage: text("market_thumbnail_image_url").notNull(),

    // Timing
    marketStarts: bigint("market_starts", { mode: "number" }).notNull(),
    marketEnds: bigint("market_ends", { mode: "number" }).notNull(),


    // Outcome and prices, will store latest prices
    outcomesAndPrices: jsonb("outcome_and_price").$type<OutcomeAndPrice[]>().notNull(),

    // Winner
    winner: jsonb("winner"),


    // Timestamp
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})


export { market }