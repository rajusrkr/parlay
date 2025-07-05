import { Request } from "express";
import { db } from "../db/dbConnection";
import { marketTable, orderTable, priceData } from "../db/schema";
import { asc, eq, sql } from "drizzle-orm";

const getAllMarket = async (req: Request, res: any) => {
  try {
    const getAllMarkets = await db
      .select({
        marketId: marketTable.marketId,
        marketTitle: marketTable.marketTitle,
        marketStarts: marketTable.marketStarts,
        marketEnds: marketTable.marketEnds,
        currentStatus: marketTable.currentStatus,
        winnerSide: marketTable.winnerSide,
        priceData: {
          yesSide: priceData.yesSidePrice,
          noSide: priceData.noSidePrice,
          updatedOn: priceData.priceUpdatedOn
        },
      })
      .from(marketTable).leftJoin(priceData, eq(priceData.marketId, marketTable.marketId));

    if (getAllMarket.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No market available" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Market fetched successfully",
        markets: getAllMarkets,
      });
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
