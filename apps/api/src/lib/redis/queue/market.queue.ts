import { Queue } from "bullmq";
import { redis } from "../redisClient";

const startMarketQueue = new Queue("market_open", { connection: redis })

export { startMarketQueue }