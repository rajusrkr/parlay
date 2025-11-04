import { OrderProducer } from "@repo/shared/src";
import { redis } from "../redisClient";
async function orderProducer({ orderData }: { orderData: OrderProducer }) {
    const streamKey = "order:new";
    const data = orderData;
    await redis.xadd(streamKey, "*", "order", JSON.stringify(data))
}

export { orderProducer }
