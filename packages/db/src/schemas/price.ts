import { bigint, jsonb, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { market } from "./market";
import { OutcomeInterface } from "@repo/shared/dist/src"

const price = pgTable("price", {
    id: serial("id").primaryKey(),
    marketId: varchar("market_id", { length: 36 }).references(() => market.marketId, { onDelete: "cascade" }).notNull(),
    outcomesAndPrices: jsonb("outcomes_and_prices").$type<OutcomeInterface[]>().notNull(),

    createdAt: bigint("created_at", { mode: "number" })
})

export { price }