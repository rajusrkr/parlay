import { type OutcomeInterface } from "@repo/shared/dist/src"

// LMSR cost function
function lmsrCostFunc({ q, b }: { q: number[], b: number }): number {
    // This is for terminating the number overflow
    const maxQ = Math.max(...q.map((qty) => qty / b)); // [5,-3,2,3]
    // e^qi/b - maxQ 
    const sumExp = q.map((qty) => Math.exp(qty / b - maxQ)).reduce((acc, val) => acc + val, 0);

    const cost = b * (maxQ + Math.log(sumExp))
    return cost;
}


// Price calculation function
function lmsrPriceFunc({ q, b }: { q: number[], b: number }): number[] {
    // Get the maxq
    const maxQ = Math.max(...q.map((qty) => qty / b));
    const expVals = q.map((qty) => Math.exp(qty / b - maxQ))
    const sumExp = expVals.reduce((acc, val) => acc + val, 0)

    const prices = expVals.map((val) => (val / Number(sumExp)))
    return prices
}

function buySellShare({ b, orderType, outcomeIndex, outcomes, qty }: { outcomes: OutcomeInterface[], b: number, outcomeIndex: number, qty: number, orderType: string }): { calculatedOutcome: OutcomeInterface[], tradeCost?: number, returnToUser?: number } {

    // Get the qty array
    const providedQty = outcomes.map((otcms) => otcms.tradedQty);
    // Calculate current cost
    const costBefore = lmsrCostFunc({ q: providedQty, b })

    // Implement switch case to handle buy and sell
    switch (orderType) {
        case "buy":
            // New qty for buy
            const addedQty = [...providedQty]
            addedQty[outcomeIndex] += qty;

            const costAfter = lmsrCostFunc({ q: addedQty, b });

            const tradeCost = (Number(costAfter) - Number(costBefore))
            const newPrices = lmsrPriceFunc({ q: addedQty, b })

            const updatedOutcomes: OutcomeInterface[] = outcomes.map((otcms, i) => ({
                ...otcms,
                price: (newPrices[i]),
                tradedQty: addedQty[i],
                totalActiveBet: ++otcms.totalActiveBet,
                totalActiveVolume: (otcms.totalActiveVolume + tradeCost)
            }))

            return { calculatedOutcome: updatedOutcomes, tradeCost }


        case "sell":
            // New qty for sell
            const substractedQty = [...providedQty]
            substractedQty[outcomeIndex] -= qty;

            const costAfterSubstraction = lmsrCostFunc({ q: substractedQty, b });
            const returnToUser = (Number(costBefore) - Number(costAfterSubstraction));
            const newPricesAfterSubstraction = lmsrPriceFunc({ q: substractedQty, b })

            const newOutcomesAfterSubstraction: OutcomeInterface[] = outcomes.map((otcms, i) => ({
                ...otcms,
                price: (newPricesAfterSubstraction[i]),
                tradedQty: substractedQty[i]
            }))

            return { calculatedOutcome: newOutcomesAfterSubstraction, returnToUser }


        default:
            throw new Error("Unknown order type")

    }
}


export { buySellShare }
