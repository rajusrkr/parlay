import { z } from "zod";

const MarketCategoryEnum = z.enum(["sports", "politics", "crypto", "regular"])

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
    marketStarts: z.number(),
    marketEnds: z.number(),
    outcomes: z.array(outcome),
    thumbnailImageUrl: z.string()
})