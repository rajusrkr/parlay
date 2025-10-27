export interface NewOrder {
    orderId: string,
    betType: string,
    selectedOutcomeIndex: number,
    outcomes: any,
    betQty: number
}

import { redis } from "../redisClient";
async function orderProducer({ orderData }: { orderData: NewOrder }) {
    const streamKey = "order:new";
    const data = orderData;
    await redis.xadd(streamKey, "*", "order", JSON.stringify(data))
}

export { orderProducer }
