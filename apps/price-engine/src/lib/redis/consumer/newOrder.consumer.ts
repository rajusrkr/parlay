import { buySellShare } from "../../lmsr/lmsrFunction";
import { redis } from "../redisClient";
import { calculationProducer } from "../producer/calculations.producer";

export interface NewOrder {
    orderId: string,
    betType: string,
    selectedOutcomeIndex: number,
    outcomes: any,
    betQty: number
}

function extractOrderData({ data }: { data: any }) {
    const orderData: Record<string, any> = {}
    for (const [_, orders] of data) {
        for (const [_, fields] of orders) {
            for (let i = 0; i < fields.length; i += 2) {
                const key = fields[i];
                const value = fields[i + 1]

                orderData[key] = JSON.parse(value)
            }
        }
    }
    return orderData
}

async function consumeNewOrder() {
    const group = "price-engine";
    const consumer = "price-engine-cons";
    const stream = "order:new"

    try {
        // Create a new group if it doesnt exists
        await redis.xgroup("CREATE", stream, group, "$", "MKSTREAM")
    } catch (error) {
        console.log(error);
    }

    while (true) {
        const res = await redis.xreadgroup("GROUP", group, consumer, "BLOCK", 5000, "STREAMS", stream, ">") as any;

        if (!res) {
            continue;
        }

        const orderData = extractOrderData({ data: res })

        const { betQty, betType, orderId, outcomes, selectedOutcomeIndex } = orderData.order as NewOrder

        if (betType === "buy") {
            console.log("this is a buy order");

            const { calculatedOutcome, tradeCost } = buySellShare({ b: 1000, orderType: betType, outcomeIndex: selectedOutcomeIndex, outcomes, qty: betQty })

            const calcs = {
                calculatedOutcome,
                tradeCost,
                orderId,
            }

            calculationProducer({ calculations: calcs })
        } else if (betType === "sell") {
            console.log("this is a sell order");

            const { calculatedOutcome, returnToUser } = buySellShare({ b: 1000, orderType: betType, outcomeIndex: selectedOutcomeIndex, outcomes, qty: betQty })

            const calcs = {
                calculatedOutcome,
                returnToUser,
                orderId,
            }

            calculationProducer({ calculations: calcs })
        } else {
            throw Error("Unknow order type received at price engine")
        }
    }

}

export { consumeNewOrder }