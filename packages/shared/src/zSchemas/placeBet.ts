import z from "zod";

const betEnum = z.enum(["buy", "sell"])

const placeBetValidation = z.object({
    betQty: z.number().min(1),
    betType: betEnum,
    marketId: z.string(),
    selectedOutcome: z.string()
})


export { placeBetValidation }