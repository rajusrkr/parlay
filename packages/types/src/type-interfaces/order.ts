import z from "zod";

const orderEnum = z.enum(["sell", "buy"])

export const OrderSchema = z.object({
    marketId: z.string().max(36),
    votedOutcome: z.string(),
    orderType: orderEnum,
    qty: z.number()
})