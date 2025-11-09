import { redis } from "../redisClient";
import { OutcomeInterface } from "@repo/shared/dist/src"

// This wont work because prices should come from orders
async function PVBUpdate({ pricesUpdateData }: { pricesUpdateData: OutcomeInterface[] }) {
    const streamKey = "prices:update";
    const data = pricesUpdateData;

    await redis.xadd(streamKey, "*", "prices:update", JSON.stringify(data))
}

export { PVBUpdate }