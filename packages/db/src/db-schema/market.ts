import { bigint, jsonb, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const CurrentMarketStatus = pgEnum("current_status", ["NOT_STARTED","OPEN","SETTLED","CANCELLED"]);
export const MarketCategory = pgEnum("market_category", ["SPORTS", "CRYPTO", "POLITICS"])

const market = pgTable("market", {
    // Market identity
    id: serial("id").primaryKey(),
    marketId: varchar("market_id", {length: 36}).notNull(),

    // Market creater identity
    marketCreatedBy: varchar("market_created_by", {length: 36}),


    // Market details
    marketTitle: varchar("market_title", {length: 255}).notNull(),
    marketOverview: text("market_overview"),
    marketSettlement: text("market_settlement"),
    currentStatus: CurrentMarketStatus().default("NOT_STARTED"),
    marketCategory: MarketCategory(),
    marketThumbnailImageUrl: text("market_thumbnail_image_url"),

    // Timing
    marketStarts: bigint("market_starts", { mode: "number" }).notNull(),
    marketEnds: bigint("market_ends", { mode: "number" }).notNull(),

    
    // Outcome and prices, will store latest prices
    outcomesAndPrices: jsonb("outcome_&_price").notNull(), 

    // Winner
    winner: jsonb("winner"),


    // Timestamp
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date())
})


export { market }