import z from "zod";

const betEnum = z.enum(["buy", "sell"])

const order = z.object({
    marketId: z.string(),
    betQty: z.number().min(1).max(1000),
    betType: betEnum,
    selectedOutcome: z.string()
})

export { order }