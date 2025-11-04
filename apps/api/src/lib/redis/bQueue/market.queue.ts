import { Queue } from "bullmq";
import { redis } from "../redisClient";

const startMarketQueue = new Queue("start_market", { connection: redis })

export { startMarketQueue }