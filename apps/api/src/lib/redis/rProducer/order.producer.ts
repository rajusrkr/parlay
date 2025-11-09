import { OrderProducer } from "@repo/shared/src";
import { redis } from "../redisClient";

interface OrderStatus {
    orderId: string,
    message: string,
    qty: number,
    tradedPrice: number
}
async function orderProducer({ orderData }: { orderData: OrderProducer }) {
    const streamKey = "order:new";
    const data = orderData;
    await redis.xadd(streamKey, "*", "order", JSON.stringify(data))
}

async function orderStatus({ orderStatus }: { orderStatus: OrderStatus }) {
    const streamKey = "order:status";
    const data = orderStatus;
    console.log(data);
    
    await redis.xadd(streamKey, "*", "orderStatus", JSON.stringify(data));
}

export { orderProducer, orderStatus, type OrderStatus }
