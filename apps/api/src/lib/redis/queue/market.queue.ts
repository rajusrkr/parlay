import { Queue } from "bullmq";
import { redis } from "../redisClient";

const startMarketQueue = new Queue("market_open", { connection: redis })
const closeMarketQueue = new Queue("market_close", {connection: redis})

export { startMarketQueue, closeMarketQueue }