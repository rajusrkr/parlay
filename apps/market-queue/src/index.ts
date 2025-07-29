import { Worker } from "bullmq";
import IORedis from "ioredis";
import { db } from "db/src/dbConnection";
import { marketTable } from "db/src/schema";
import { eq } from "drizzle-orm";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

console.log("Hello there it is market queue");

const startMarketWorker = new Worker(
  "market_starter",
  async (job) => {
    // switch case

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

const closeMarketWorker = new Worker(
  "market_closer",

  async (job) => {
    console.log("Closing market", job.id);

    const marketId = job.data.id;

    await db
      .update(marketTable)
      .set({ currentStatus: "SETTLED" })
      .where(eq(marketTable.marketId, marketId));
    
    console.log('Market closed', marketId);
    
  },
  {connection}
);

startMarketWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed`, error);
});

startMarketWorker.on("completed", (job) => {
  console.log(`Job ${job.id} has been completed`);
});


closeMarketWorker.on("completed", (job) => {
  console.log(`Closing job ${job.id} has been completed`);
})

closeMarketWorker.on("failed", (job, error) => {
  console.log(`Closing job ${job?.id} failed`, error);
  
})
