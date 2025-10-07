import { z } from "zod";

const MarketCategoryEnum = z.enum(["sports", "politics", "crypto", "regular"])
const MarketType = z.enum(["binary", "other"])

const outcome = z.object({
    outcome: z.string(),
    price: z.string(),
    tradedQty: z.number()
})

export const MarketCreationSchema = z.object({
    title: z.string().max(200),
    description: z.string().max(500),
    settlement: z.string().max(500),
    marketCategory: MarketCategoryEnum,
    marketType: MarketType,
    marketStarts: z.number(),
    marketEnds: z.number(),
    outcomes: z.array(outcome),
    thumbnailImage: z.string()
}).strict()

export const MarketEditSchema = z.object({
    marketId: z.string().optional(),
    title: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    settlement: z.string().max(500).optional(),
    currentStatus: z.string().optional(),
    marketCategory: MarketCategoryEnum.optional(),
    marketType: MarketType.optional(),
    marketStarts: z.number().optional(),
    marketEnds: z.number().optional(),
    outcomes: z.array(outcome).optional(),
    thumbnailImage: z.string().optional(),
    winnerSide: z.string().nullable().optional()
}).strict()


export type marketType = "binary" | "other"; 
export type marketCategory = "sports" |"politics" |"crypto" |"regular"; 

export interface MarketTypeInterface {
    marketId?: string
    title: string
    description: string
    settlement: string
    currentStatus?: string
    marketCategory: marketCategory
    marketType: marketType
    marketStarts: number
    marketEnds: number
    winnerSide? : string,
    outcomes: {
        outcome: string
        price: string
        tradedQty: number
    }[],
    thumbnailImage: string
}