interface NewOrder {
    orderType: string,
    outcomeIndex: number,
    outcomes: any,
    qty: number
}
import { redis } from "../redisClient";
async function orderProducer({ orderData }: { orderData: NewOrder }) {
    const streamKey = "order:new";
    const data = orderData;
    await redis.xadd(streamKey, "*", "order", JSON.stringify(data))
}

export { orderProducer }