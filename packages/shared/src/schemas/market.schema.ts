import { z } from "zod";

export const MarketSchema = z.object({
    marketTitle: z.string().max(50),
    side1: z.string().max(15),
    side2: z.string().max(15),
    marketStarts: z.string().datetime({offset: true, message: "Invalid date format"}),
    marketEnds: z.string().datetime({offset: true, message: "Invalid date format"}),
})