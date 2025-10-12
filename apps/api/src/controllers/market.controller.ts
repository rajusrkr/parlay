import { Request } from "express";

import { admin, db } from "@repo/db/dist/src";
import { market } from "@repo/db/dist/src";
import { eq } from "drizzle-orm"

// Get all markets
const getAllMarket = async (req: Request, res: any) => {
  try {
    const markets = await db
      .select({
        marketId: market.marketId,
        title: market.title,
        description: market.description,
        settlement: market.settlement,
        marketStarts: market.marketStarts,
        marketEnds: market.marketEnds,
        currentStatus: market.currentStatus,
        marketCategory: market.marketCategory,
        winnerSide: market.winnerSide,
        outcomes: market.outcomes,
      })
      .from(market)

    if (markets.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No markets found" });
    }

    return res.status(200).json({ success: true, markets });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Get market by id
const getMarketById = async (req: Request, res: any) => {
  const ids = req.query;

  const marketId = ids.marketId!.toString();

  try {
    const getMarketById = await db.select({
      marketId: market.marketId,
      title: market.title,
      description: market.description,
      settlement: market.settlement,
      marketStarts: market.marketStarts,
      marketEnds: market.marketEnds,
      currentStatus: market.currentStatus,
      marketCategory: market.marketCategory,
      winnerSide: market.winnerSide,
      outcomes: market.outcomes,
    }).from(market).where(eq(market.marketId, marketId))

    console.log(getMarketById);


    return res.status(200).json({ message: "Market details fetched", market: getMarketById, success: true })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" })
  }

}

export {
  getAllMarket,
  getMarketById
};
