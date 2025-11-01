import { redis } from "../redisClient";

interface Calculation {
    calculatedOutcome: any,
    tradeCost?: number,
    returnToUser?: number,
    orderId: string
}

async function calculationProducer({ calculations }: { calculations: Calculation }) {
    const streamKey = "order:calc";
    const data = calculations;

    await redis.xadd(streamKey, "*", "orderCals", JSON.stringify(data))
}

export { calculationProducer }