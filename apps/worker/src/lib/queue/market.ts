import { Worker } from "bullmq";
import Redis from "ioredis";
import {db, market} from "@repo/db/dist/src"
import {eq} from "drizzle-orm"


class MarketQueue {
  private redis: Redis;
  constructor(redis: Redis) {
    this.redis = redis;
  }
  open(){
    new Worker("market_open", async (job) => {
        const marketId = job.data.marketId;
        this.updateMarletStatus(marketId)
    }, {connection: this.redis}).on("completed", (job) => console.log(`Market Open Queue: market with id ${job.data.marketId} is now open.`)
    )
  }


  private async updateMarletStatus(marketId: string){
    try {
        await db.update(market).set({
            currentStatus: "open"
        }).where(eq(market.marketId, marketId))
    } catch (error) {
        throw new Error(`Unable to change market status to open for the market:${marketId}. Error: ${error instanceof Error ? error.message : "Unknown"}` )
    }
  }
}

export { MarketQueue };

/**
 * I need redis also in another places
 *
 * What will be the job this market worker???
 * 1. Opening market
 * 2. Closing market
 * 3. Change market  status, like open to stale
 * 4. Users balance settle
 *      How i will settle users balance
 *          => Get the winner and the Market, and then make a db call
 *             to update the market outcomes, update the winner and make
 *             the price 1, and update the winner
 *      Do not update those position that have 0 qty
 *      add column in position table => settled_price
 */
