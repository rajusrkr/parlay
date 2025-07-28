import { Worker } from "bullmq";
import IORedis from "ioredis";
import { db } from "db/src/dbConnection";
import { marketTable } from "db/src/schema";
import { eq } from "drizzle-orm";

const connection = new IORedis({host: "127.0.0.1", port: 6379, maxRetriesPerRequest: null});

console.log("Hello there it is market queue");


const worker = new Worker(
  "market_starter",
  async (job) => {
    console.log("Processing market", job.id);

    console.log(job);
    

    const marketId = job.data.id;

    await db
      .update(marketTable)
      .set({ currentStatus: "OPEN" })
      .where(eq(marketTable.marketId, marketId));

    console.log(`Market ${marketId} started`);
  },
  { connection }
);

worker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed`, error);
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});
