import { Request, Response } from "express";
import { v4 as uuidv4, validate } from "uuid";
import { db } from "@repo/db/dist/src"
import { market } from "@repo/db/dist/src"
import { eq, and } from "drizzle-orm";
import { OutcomeInterface, BuyOrderSchema } from "@repo/shared/dist/src"
import { sendOrderToWsServer } from "../ws/sendOrderToWsServer";

// create a new map
export const pendingRequests = new Map<
  string,
  { res: Response; userId: string; marketId: string; orderType: string; userOrderQty: number; outcomesAndPrices: OutcomeInterface[]; votedOutcomeIndex: number; votedOutcome: string; wsResponse: any }
>();

const handleOrder = async (req: Request, res: any) => {
  const orderData = req.body;
  // @ts-ignore
  const userId = req.userId;

  const validateData = BuyOrderSchema.safeParse(orderData)
  const { success, data, error } = validateData

  if (!success) {
    console.log(error);
    return res.status(400).json({ success: false, message: "Invalid data received, send data in correct format, Zod validation error" })
  }

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
        .json({ success: false, message: "Error: market does not exists or market status is not OPEN" });
    }

    const indexForVotedOutcome = marketDetails[0].outcome.findIndex((outcms) => outcms.title === data.selectedOutcome)

    const requestId = uuidv4();

    pendingRequests.set(requestId, {
      res,
      userId,
      marketId: data.marketId,
      orderType: data.betType,
      userOrderQty: data.betQty,
      outcomesAndPrices: marketDetails[0].outcome,
      votedOutcomeIndex: indexForVotedOutcome,
      votedOutcome: data.selectedOutcome,
      wsResponse: null,
    });

    // Send order to ws server
    sendOrderToWsServer({
      eventType: "newOrder",
      requestId,
      data: {
        outcomes: marketDetails[0].outcome,
        qty: data.betQty,
        orderType: data.betType,
        votedOutcomeIndex: indexForVotedOutcome
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { handleOrder };
