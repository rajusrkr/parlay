import { eq, and } from "drizzle-orm";
// Will create two functions, 1. For buy order and 2. Sell order

import { db, market, order, position, user } from "@repo/db/dist/src";

async function completeBuyOrder(data: any) {

    const { marketId, orderType, userId, tradeCost, selectedOutcome, returnToUser } = data;

    try {
        const marketDetails = await db.select().from(market).where(and(
            eq(market.currentStatus, "open"),
            eq(market.marketId, marketId)
        ))

        if (!marketDetails) {
            console.log("No market details found");
            return
        }

        const [userDetails] = await db.select().from(user).where(eq(user.userId, userId));
        if (!userDetails) {
            console.log("No user found");
            return
        }

        if (orderType === "buy") {
            if (userDetails.walletBalance! < tradeCost) {
                console.log("Balance is not suffiecient for this order");
                return
            }

            const newWalletBalance = userDetails.walletBalance! - tradeCost;

            await db.update(user).set({
                walletBalance: newWalletBalance
            }).where(eq(user.userId, userId))

            await db.insert(position).values({
                positionId: "jdch",
                positionTakenBy: userId,
                positionTakenFor: selectedOutcome,
                positionTakenIn: marketId,
                totalQtyAndAvgPrice: {
                    totalQty: 120,
                    avgPrice: "120",
                    atTotalCost: "120",
                },
                pnL: 0
            })
        } else if (orderType === "sell") {
            const [positionDetails] = await db.select().from(position).where(and(
                eq(position.positionTakenIn, marketId),
                eq(position.positionTakenBy, userId),
                eq(position.positionTakenFor, selectedOutcome)
            ))

            if (!positionDetails) {
                console.log("No position found");
                return
            }

            const newWalletBalance = userDetails.walletBalance + returnToUser

            await db.update(user).set({
                walletBalance: newWalletBalance
            }).where(eq(user.userId, userId))

            await db.update(position).set({

            })
        } else {
            console.log("Unknow order type");
            return
        }

        await db.insert(order).values({
            orderId: "ah",
            orderPlacedBy: userId,
            orderQty: 0,
            orderTakenIn: marketId,
            orderType,
            updatedPrices: [],
            averageTradedPrice: 1,
            orderPlacedFor: selectedOutcome,

        })

        await db.update(market).set({
            outcomes: []
        })


        // Stream three this from here
        /**
         * 1. Portfolio
         * 2. Order status
         * 3. Prices
         */


    } catch (error) {
        console.log(error);
    }
}
