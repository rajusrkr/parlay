import { Request, Response } from "express";
import { db } from "../db/dbConnection";
import { marketTable } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { sendOrderToWsServer } from "../ws/send-order";
import { v4 as uuidv4 } from "uuid";

// create a new map
export const pendingRequests = new Map<
  string,
  { res: Response; userId: string; marketId: string; orderSide: string; orderType: string; userOrderQty:number; wsResponse: any }
>();

const handleOrder = async (req: Request, res: any) => {
  const data = req.body;

  // @ts-ignore
  const userId = req.userId;
  // do perform checks here, skiping for now
  try {
    const getMarketDetailsById = await db
      .select()
      .from(marketTable)
      .where(
        and(
          eq(marketTable.marketId, data.marketId),
          eq(marketTable.currentStatus, "OPEN")
        )
      );

    if (getMarketDetailsById.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Check market status" });
    }

    const requestId = uuidv4();

    pendingRequests.set(requestId, {
      res,
      userId,
      marketId: data.marketId,
      orderSide: data.orderSide,
      orderType: data.orderType,
      userOrderQty: data.orderQty,
      wsResponse: null,
    });

    // THIS IS THE PLACE WHERE I AM SENDING THE ORDER TO WS-SERVER
    sendOrderToWsServer({
      eventType: "newOrder",
      requestId,
      data: {
        userOrderSide: data.orderSide,
        userOrderType: data.orderType,
        userOrderQty: data.orderQty,
        prevYesSideQty: getMarketDetailsById[0].totalYesQty,
        prevNoSideQty: getMarketDetailsById[0].totalNoQty,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { handleOrder };
