import z from "zod"

export type betTypeEnum = "buy" | "sell"

const betEnum =  z.enum(["buy", "sell"])

export interface OrderInterface {
    marketId: string,
    betQty: number,
    betType: betTypeEnum,
    selectedOutcome: string
}


export const BuyOrderSchema = z.object({
    marketId: z.string(),
    betQty: z.number().min(1).max(1000),
    betType: betEnum.default("buy"),
    selectedOutcome: z.string()
})