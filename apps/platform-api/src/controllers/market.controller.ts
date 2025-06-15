import { Request } from "express";
import { db } from "../db/dbConnection";
import { marketTable } from "../db/schema";

const getAllMarket = async (req: Request, res: any) => {
    try {
        const getAllMarkets = await db.select({
            marketId: marketTable.marketId,
            marketTitle: marketTable.marketTitle,
            yesSide: marketTable.yesSide,
            noSide: marketTable.noSide,
            marketStarts: marketTable.marketStarts,
            marketEnds: marketTable.marketEnds,
            currentStatus: marketTable.currentStatus,
            winnerSide: marketTable.winnerSide
        }).from(marketTable)

        if (getAllMarket.length === 0) {
            return res.status(400).json({success: false, message: "No market available"})
        }

        return res.status(200).json({success: true, message:"Market fetched successfully", markets: getAllMarkets})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}

export {getAllMarket}