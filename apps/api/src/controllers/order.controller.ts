import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "@repo/db/dist/src"
import { market } from "@repo/db/dist/src"
import { eq, and } from "drizzle-orm";
import { OrderSchema } from "@repo/shared/dist/src"
import { OutcomeAndPrice } from "@repo/db/dist/src/schemas/market";
import { sendOrderToWsServer } from "../ws/sendOrderToWsServer";

// create a new map
export const pendingRequests = new Map<
  string,
  { res: Response; userId: string; marketId: string; orderType: string; userOrderQty: number; outcomesAndPrices: OutcomeAndPrice[]; votedOutcomeIndex: number; votedOutcome: string; wsResponse: any }
>();

const handleOrder = async (req: Request, res: any) => {
  const data = req.body;

  // @ts-ignore
  const userId = req.userId;


  const validateData = OrderSchema.safeParse(data)

  if (!validateData.success) {
    return res.status(400).json({ message: "Invalid data received", error: validateData.error })
  }

  const { marketId, votedOutcome, orderType, qty } = validateData.data

  try {
    const marketDetails = await db
      .select({ outcome: market.outcomes })
      .from(market)
      .where(
        and(
          eq(market.marketId, data.marketId),
          eq(market.currentStatus, "open")
        )
      );

    if (marketDetails.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Check market status, market is not open or no market exists with this id" });
    }

    const indexForVotedOutcome = marketDetails[0].outcome.findIndex((outcms) => outcms.outcome === votedOutcome)
    if (indexForVotedOutcome < 0) {
      return res.status(400).json({ success: false, message: "Voted outcome is not valid." })
    }
    const requestId = uuidv4();

    pendingRequests.set(requestId, {
      res,
      userId,
      marketId,
      orderType,
      userOrderQty: qty,
      outcomesAndPrices: marketDetails[0].outcome,
      votedOutcomeIndex: indexForVotedOutcome,
      votedOutcome,
      wsResponse: null,
    });

    // Send order to ws server
    sendOrderToWsServer({
      eventType: "newOrder",
      requestId,
      data: {
        outcomes: marketDetails[0].outcome,
        qty,
        orderType,
        votedOutcomeIndex: indexForVotedOutcome
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { handleOrder };
