import { OrderStore } from "@repo/shared/src";
import { redis } from "../redisClient";


async function orderStore({ order }: { order: OrderStore }) {
    await redis.hset(`order:${order.orderId}`, "data",JSON.stringify(order))
}

export { orderStore }