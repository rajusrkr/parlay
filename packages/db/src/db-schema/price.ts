import { bigint, jsonb, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { market } from "./market";

interface OutcomeAndPrice {
    outcome: string,
    price: string,
    tradedQty: number
}

const price = pgTable("price", {
    id: serial("id").primaryKey(),
    marketId: varchar("market_id", { length: 36 }).references(() => market.marketId),
    outcomesAndPrices: jsonb("outcomes_and_prices").$type<OutcomeAndPrice[]>().notNull(),

    createdAt: bigint("created_at", { mode: "number" })
})

export { price }