import z from "zod";

const validateLMSRCalculations = z.object({
    tradeCost: z.number().optional(),
    returnToUser: z.number().optional(),
    orderId: z.string(),
    calculatedOutcome: z.array(z.object({
        price: z.number(),
        title: z.string(),
        tradedQty: z.number(),
        totalActiveBet: z.number(),
        totalActiveVolume: z.number()
    }))
})



// const validateMergedData = z.object({
//     tradeCost: z.number(),
//     orderId: z.string(),
//     calculatedOutcome: z.array(z.object({
//         price: z.number(),
//         title: z.string(),
//         tradedQty: z.number(),
//         totalActiveBet: z.number(),
//         totalActiveVolume: z.number()
//     })),
//     betQty: z.number(),
//     betType: z.string(),
//     marketId: z.string(),
// })


const fullOrderValidation = z.object({
    selectedOutcome: z.string(),
    selectedOutcomeIndex: z.number(),
    userId: z.string(),
    orderId: z.string(),
    marketId: z.string(),
    betType: z.string(),
    betQty: z.number(),
    outcomes: z.array(z.object({
        price: z.number(),
        title: z.string(),
        tradedQty: z.number(),
        totalActiveBet: z.number(),
        totalActiveVolume: z.number()
    })),
})
export { validateLMSRCalculations, fullOrderValidation }