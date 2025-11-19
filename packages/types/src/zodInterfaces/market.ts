import z from "zod";

const outcome = z.object({
    title: z.string(),
    price: z.number(),
    totalActiveTradingVolume: z.number()
}).strict()

const MarketCategoryEnum = z.enum(["sports", "politics", "crypto", "regular"])


const createMarket = z.object({
    title: z.string().max(200),
    description: z.string().max(500),
    settlement: z.string().max(500),
    marketCategory: MarketCategoryEnum,
    marketStarts: z.number(),
    marketEnds: z.number(),
    outcomes: z.array(outcome),
    cryptoDetails: z.object({
        interval: z.string(),
        symbol: z.string()
    }).optional()
}).strict()

const editMarket = z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    settlement: z.string().max(500).optional(),
    marketCategory: MarketCategoryEnum.optional(),
    currentStatus: z.string().optional(),
    marketStarts: z.number().optional(),
    marketEnds: z.number().optional(),
}).strict()


export { createMarket, editMarket }