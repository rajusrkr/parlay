import { z } from "zod";

const MarketCategoryEnum = z.enum(["sports", "politics", "crypto", "regular"])

const outcome = z.object({
    title: z.string(),
    price: z.number(),
    tradedQty: z.number(),
    totalActiveBet: z.number(),
    totalActiveVolume: z.number()
})

export const MarketCreationSchema = z.object({
    title: z.string().max(200),
    description: z.string().max(500),
    settlement: z.string().max(500),
    marketCategory: MarketCategoryEnum,
    marketStarts: z.number(),
    marketEnds: z.number(),
    outcomes: z.array(outcome),
}).strict()

export const MarketEditSchema = z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    settlement: z.string().max(500).optional(),
    marketCategory: MarketCategoryEnum.optional(),
    currentStatus: z.string().optional(),
    marketStarts: z.number().optional(),
    marketEnds: z.number().optional(),
    winnerSide: z.string().nullable().optional()
}).strict()


export type marketCategory = "sports" | "politics" | "crypto" | "regular";

export interface OutcomeInterface {
    title: string,
    price: number,
    tradedQty: number
    totalActiveBet: number,
    totalActiveVolume: number
}

// Not needed
export interface MarketTypeInterface {
    marketId?: string
    title: string
    description: string
    settlement: string
    currentStatus?: string
    marketCategory: marketCategory
    marketStarts: number
    marketEnds: number
    winnerSide?: string,
    outcomes: {
        outcome: string
        price: string
        tradedQty: number
    }[],
    thumbnailImage: string
}

export interface MarketCreationInterface {
    title: string
    description: string
    settlement: string
    currentStatus: string
    marketCategory: marketCategory
    marketStarts: number
    marketEnds: number
    outcomes: {
        title: string,
        price: number,
        tradedQty: number
        totalActiveBet: number,
        totalActiveVolume: number
    }[]
}

export interface MarketsInterface {
    marketId: string
    title: string
    description: string
    currentStatus: string
    marketCategory: string
    marketStarts: number
    marketEnds: number
    outcomes?: OutcomeInterface[]
}

export interface MarketByIdInterface {
    marketId: string
    title: string
    description: string
    currentStatus: string
    marketCategory: string
    marketStarts: number
    marketEnds: number
    outcomes: OutcomeInterface[]
    settlement: string
    winnerSide: string
    orderHistory: {
        personName: string
        orderQty: number,
        orderExecutionPrice: number
    }
}