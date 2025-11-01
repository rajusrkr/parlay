import { redis } from "../redisClient";

export interface OrderStore {
    orderId: string,
    userId: string,
    betQty: number,
    betType: string,
    marketId: string,
    outcomes: any,
    selectedOutcome: string,
    selectedOutcomeIndex: number,
}

async function orderStore({ order }: { order: OrderStore }) {
    await redis.hset(`order:${order.orderId}`, "data",JSON.stringify(order))
}

export { orderStore }