import { any, z } from "zod";

const MarketCategoryEnum = z.enum(["SPORTS", "POLITICS", "CRYPTO"])

export const MarketSchema = z.object({
    title: z.string().max(200),
    overview: z.string().max(500),
    settlement: z.string().max(500),
    marketType: z.string().max(10),
    marketCategory: MarketCategoryEnum,
    marketStarts: z.number(),
    marketEnds: z.number(),
    outcomes: any,
    thumbnailImageUrl: z.string()
})