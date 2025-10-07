import { Request } from "express";

import { db } from "@repo/db/dist/src";
import { market } from "@repo/db/dist/src";

const getAllMarket = async (req: Request, res: any) => {
  try {
    // get markets
    const markets = await db
      .select({
        marketId: market.marketId,
        title: market.marketTitle, 
        description: market.marketOverview,
        settlement: market.marketSettlement,
        thumbnailImage: market.thumbnailImage,
        marketStarts: market.marketStarts,
        marketEnds: market.marketEnds,
        currentStatus: market.currentStatus,
        marketCategory: market.marketCategory,
        marketType: market.marketType,
        winnerSide: market.winner,
        outcomes: market.outcomesAndPrices,
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

// const getPrices = async (req: Request, res: any) => {
//   const data = req.body;

//   try {
//     const result = await db
//       .select()
//       .from(order)
//       .orderBy(asc(order.priceUpdatedOn))
//       .where(eq(priceData.marketId, data.marketId));

//     return res.status(200).json({ res: result });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// };

export {
  getAllMarket,
  //  getPrices
};
