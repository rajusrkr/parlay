import { Request } from "express";


import {db} from "db/src/dbConnection"
import { marketTable, priceData} from "db/src/schema"
import { asc, eq } from "drizzle-orm";

const getAllMarket = async (req: Request, res: any) => {
  try {
    
    // get markets
    const markets = await db
      .select({
        marketId: marketTable.marketId,
        marketTitle: marketTable.marketTitle,
        marketStarts: marketTable.marketStarts,
        marketEnds: marketTable.marketEnds,
        currentStatus: marketTable.currentStatus,
        winnerSide: marketTable.winnerSide,
      })
      .from(marketTable).where(eq(marketTable.currentStatus, "OPEN"))


      if (markets.length === 0) {
        return res.status(404).json({success: false, message: "No markets found"})
      }

      // get prices
      const prices = await db.select().from(priceData).orderBy(asc(priceData.priceUpdatedOn))

      if (prices.length === 0) {
        return res.status(400).json({success: false, message: "Prices are not available"})
      }


      // group prices
      const pricesMap = new Map<string, Array<{yes: {value: number, time: number}, no: {value: number, time: number}}>>()

      for (const price of prices) {
        // it creates an empty array with the id if it is not available
        if (!pricesMap.has(price.marketId!)) {
          pricesMap.set(price.marketId!, [])
        }

        // push prices to pricesMap by id
        pricesMap.get(price.marketId!)!.push({yes: {time: price.priceUpdatedOn!, value: Number(price.yesSidePrice)}, no: {time: price.priceUpdatedOn!, value: Number(price.noSidePrice)}})
      }

      // merge those two, markets and pricemap
      const merged = markets.map((market) => ({
        ...market,
        prices: pricesMap.get(market.marketId) || []
      }))

      return res.status(200).json({success: true, markets: merged})

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getPrices = async (req: Request, res: any) => {
  const data = req.body;
  console.log(data);
  
  try {
    const result = await db.select().from(priceData).orderBy(asc(priceData.priceUpdatedOn)).where(eq(priceData.marketId, data.marketId))

    return res.status(200).json({ res: result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { getAllMarket, getPrices };
