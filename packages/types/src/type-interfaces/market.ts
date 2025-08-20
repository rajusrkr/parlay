import { z } from "zod";

const MarketCategoryEnum = z.enum(["sports", "politics", "crypto", "regular"])
const MarketType = z.enum(["binary", "other"])

const outcome = z.object({
    outcome: z.string(),
    price: z.string(),
    tradedQty: z.number()
})

export const MarketSchema = z.object({
    title: z.string().max(200),
    overview: z.string().max(500),
    settlement: z.string().max(500),
    marketCategory: MarketCategoryEnum,
    marketType: MarketType,
    marketStarts: z.number(),
    marketEnds: z.number(),
    outcomes: z.array(outcome),
    thumbnailImageUrl: z.string()
})


// Type interface
interface OutcomeAndPrice {
    price: string,
    outcome: string,
    tradedQty: number
}


interface MarketData {
    marketId: string,
    marketTitle: string,
    marketOverview: string,
    marketSettlement: string,
    currentStatus: string,
    marketCategory: string,
    marketType: string,
    thumbnailImage: string,
    marketStarts: number,
    marketEnds: number,
    winnerSide: string,
    outcomesAndPrices: OutcomeAndPrice[]
}


export type { MarketData }