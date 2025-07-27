import { z } from "zod";

export const MarketSchema = z.object({
    title: z.string().max(200),
    overview: z.string().max(200),
    settlement: z.string().max(200),
    marketType: z.string().max(10),
    marketStarts: z.number(),
    marketEnds: z.number()
})