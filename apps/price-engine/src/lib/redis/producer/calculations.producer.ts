import { OrderCalc } from "@repo/shared/src";
import { redis } from "../redisClient";


async function calculationProducer({ calculations }: { calculations: OrderCalc }) {
    const streamKey = "order:calc";
    const data = calculations;

    await redis.xadd(streamKey, "*", "orderCals", JSON.stringify(data))
}

export { calculationProducer }