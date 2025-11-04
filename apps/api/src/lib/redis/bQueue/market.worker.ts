import { Worker } from "bullmq";
import { redis } from "../redisClient";
import { db, market } from "@repo/db/dist/src";
import { eq } from "drizzle-orm"

interface MarketStart {
    marketId: string
}

async function updateMarketStatusAndUpdatePrices(marketId: string) {
    try {
        await db.update(market).set({
            currentStatus: "open"
        }).where(eq(market.marketId, marketId))
    } catch (error) {
        console.log(error);
    }
}

function marketWorker() {
    // Market start worker
    new Worker("start_market",
        async (job) => {
            const { marketId } = job.data as MarketStart;
            await updateMarketStatusAndUpdatePrices(marketId)
        }, { connection: redis }
    ).on("completed", (job) => {
        console.log(`JOB WITH ID ${job.id} HAS BEEN SUCCESSFULLY PROCESSED at ${job.processedOn}`);
    })

    // Market resolver/closer
    new Worker("market_resolver", async (job) => {
        console.log(job);
    }, { connection: redis })
}

export { marketWorker }