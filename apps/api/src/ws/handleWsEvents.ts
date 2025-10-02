import { WsPayload } from "@repo/shared/dist/src";
import { pendingRequests } from "../controllers/order.controller";
import { db } from "@repo/db/dist/src";
import { market, order, position, price, user } from "@repo/db/dist/src";
import { and, eq } from "drizzle-orm"
import { v4 as uuidV4 } from "uuid"
import { ws } from "./wsConnection";

export function handleWsEvents() {

    /**
     * Currently have two ws events, 1. authEvent and 2. priceUpdate event for platform api
     * Will use switch case here
     * Auth event is simple, just log the message
     * 
     * The price update will take some time.
     * To complete an order I will follow below steps
     * Will get the pending request array/map from order controlls
     * Het the price update request id and will match it, and also match the votedindex
     * After will check the order type, buy/sell
     * If its a buy order:
     *  - Check if the market is tradeable or not
     *  - Check user balance if its sufficient or not
     *  - Get the average price
     *  - Deduct the balance
     *  - Create new order
     *  - Create or Update position
     *  - Enter prices in price table
     *  - Update the market
     *  - Send price updates to ws server to broad cast it to the UIs
     * If its a sell order
     *  - Check if the market is tradeable or not
     *  - Check if user exists with this id or not
     *  - Then check if the user has any buy order for that same market with the same outcome
     *  - Check the qty, if it is greater than available
     *  - Go for db transaction
     *  - If the placed oredr qty === total available qty, make the position settled
     *  - Add the return balance in user balance
     *  - Insert order in order table
     *  - Send the prices to UIs
     *  - Update the market
     */

    ws.on("message", async (msg) => {
        const parsedMessage: WsPayload = JSON.parse(msg.toString())

        const { eventType, requestId, data } = parsedMessage;

        switch (eventType) {
            case "authAck":
                console.log("Event type:", eventType);
                console.log("Message:", data.message);
                break

            case "priceUpdate":
                const pendingRequest = pendingRequests.get(requestId!)
                if (!pendingRequest) return;

                const { orderType, qty, outcomes, returnToUser, tradeCost } = data;
                const { res, marketId, userId, votedOutcome } = pendingRequest

                if (orderType === "buy") {
                    // Check market
                    const marketDetails = await db.select().from(market).where(and(
                        eq(market.marketId, marketId),
                        eq(market.currentStatus, "open")
                    ))

                    if (marketDetails.length === 0) {
                        return res.status(400).json({ success: false, message: "This market is not tradeable" })
                    }

                    // Get user and balance check
                    const userDetails = await db.select({ balance: user.walletBalance }).from(user).where(eq(user.userId, userId))

                    if (userDetails.length === 0) {
                        return res.status(400).json({ success: false, message: "User details not found" })
                    }

                    if (Number(userDetails[0].balance) < Number(tradeCost)) {
                        return res.status(400).json({ success: false, message: "Insuffiecient balance" })
                    }

                    const averageCost = parseFloat((Number(tradeCost) / qty!).toString()).toFixed(2);
                    const newWalletBalance = parseFloat((Number(userDetails[0].balance) - Number(tradeCost)).toString()).toFixed(2);

                    await db.transaction(async (tx) => {
                        // Deduct the balance
                        await tx.update(user).set({
                            walletBalance: newWalletBalance.toString()
                        }).where(eq(user.userId, userId))

                        const averageTradedPrice = parseFloat((Number(tradeCost) / qty!).toString()).toFixed(2);

                        // Create new order
                        await tx.insert(order).values({
                            orderId: requestId!,
                            orderQty: qty!,
                            orderType,
                            orderPlacedFor: votedOutcome,
                            averageTradedPrice,
                            updatedPrices: outcomes,
                            orderPlacedBy: userId,
                            orderTakenIn: marketId,
                        })

                        // Create or Update position
                        // Get position if any
                        const prevPosition = await tx.select({ qtyAndAvgPrice: position.totalQtyAndAvgPrice }).from(position).where(and(
                            eq(position.positionTakenIn, marketId),
                            eq(position.positionTakenBy, userId),
                            eq(position.positionTakenFor, votedOutcome)
                        ))
                        // Create new position if position not available
                        if (prevPosition.length === 0) {
                            await tx.insert(position).values({
                                positionId: uuidV4(),
                                positionTakenBy: userId,
                                positionTakenIn: marketId,
                                positionTakenFor: votedOutcome,
                                totalQtyAndAvgPrice: { totalQty: qty!, avgPrice: averageCost.toString(), atTotalCost: tradeCost!.toString() }
                            })
                        } else {
                            // If position available
                            const { totalQty, atTotalCost } = prevPosition[0].qtyAndAvgPrice;
                            const newQty = totalQty + qty!
                            const newTotalCost = parseFloat((Number(atTotalCost) + Number(tradeCost)).toString()).toFixed(2)
                            const newAvgPrice = parseFloat((Number(newTotalCost) / newQty).toString()).toFixed(2);

                            // Update the position
                            await tx.update(position).set({
                                totalQtyAndAvgPrice: { totalQty: newQty, avgPrice: newAvgPrice, atTotalCost: newTotalCost.toString() }
                            }).where(and(
                                eq(position.positionTakenIn, marketId),
                                eq(position.positionTakenBy, userId)
                            ))
                        }


                        // Price entry
                        await tx.insert(price).values({
                            marketId,
                            outcomesAndPrices: outcomes!
                        })

                        // Update the market prices and outcome
                        await tx.update(market).set({
                            outcomesAndPrices: outcomes
                        }).where(eq(market.marketId, marketId!))

                        // TODO: Broad cast the prices here
                        const update: WsPayload = {
                            eventType: "priceBroadCast",
                            marketId,
                            data: {
                                outcomes: outcomes
                            }
                        }
                        ws.send(JSON.stringify(update))

                    }).then(() => {
                        return res.status(200).json({ success: true, message: "Order placed successfully" })
                    }).catch((error) => {
                        return res.status(400).json({ success: false, message: "Order placement failed", reason: error })
                    })
                } else if (orderType === "sell") {
                    // Check market
                    const marketDetails = await db.select().from(market).where(and(
                        eq(market.marketId, marketId),
                        eq(market.currentStatus, "open")
                    ))

                    if (marketDetails.length === 0) {
                        return res.status(400).json({ success: false, message: "This market is not tradeable" })
                    }

                    // Check user 
                    const userDetails = await db.select({ walletBalance: user.walletBalance }).from(user).where(eq(user.userId, userId))

                    if (userDetails.length === 0) {
                        return res.status(400).json({ success: false, message: "User details not found" })
                    }

                    // Get position
                    const getPosition = await db.select().from(position).where(and(
                        eq(position.positionTakenIn, marketId),
                        eq(position.positionTakenBy, userId),
                        eq(position.positionTakenFor, votedOutcome)
                    ))


                    if (getPosition.length === 0) {
                        return res.status(400).json({ success: false, message: "You don't have any open position for this market and outcome." })
                    }

                    const { totalQty, avgPrice } = getPosition[0].totalQtyAndAvgPrice;

                    // Check the qty
                    if (qty! > totalQty) {
                        return res.status(400).json({ success: false, message: `You dont have ${qty} shares to sell` })
                    }

                    // DB transactions
                    await db.transaction(async (tx) => {

                        // If qty equal
                        if (qty! === totalQty) {
                            await tx.update(position).set({
                                totalQtyAndAvgPrice: { atTotalCost: "0", totalQty: 0, avgPrice: "0" },
                                isPositionSettled: true
                            }).where(and(
                                eq(position.positionTakenBy, userId),
                                eq(position.positionTakenFor, votedOutcome),
                                eq(position.positionTakenIn, marketId)
                            ))
                        } else {

                            // If quantity is small than the available
                            const newTotalQty = totalQty - qty!;
                            const newAtTotalCost = parseFloat((newTotalQty * Number(avgPrice)).toString()).toFixed(2)

                            // wrong implementation
                            await tx.update(position).set({
                                totalQtyAndAvgPrice: { atTotalCost: newAtTotalCost, totalQty: newTotalQty, avgPrice }
                            })
                        }

                        // Return balance to user wallet
                        const newWalletBalance = Number(userDetails[0].walletBalance!) + Number(returnToUser)

                        await tx.update(user).set({
                            walletBalance: newWalletBalance.toString()
                        }).where(eq(user.userId, userId))

                        const averageTradedPrice = parseFloat((Number(returnToUser) / qty!).toString()).toFixed(2);

                        // Insert order
                        await tx.insert(order).values({
                            orderId: uuidV4(),
                            orderPlacedBy: userId,
                            orderTakenIn: marketId,
                            orderPlacedFor: votedOutcome,
                            averageTradedPrice,
                            orderQty: qty!,
                            orderType,
                            updatedPrices: outcomes
                        })

                        // Insert price
                        await tx.insert(price).values({
                            marketId,
                            outcomesAndPrices: outcomes!
                        })

                        // Update market
                        await tx.update(market).set({
                            outcomesAndPrices: outcomes!
                        }).where(eq(market.marketId, marketId))
                    }).then(() => {
                        return res.status(200).json({ success: true, message: "Sell order successfull" })
                    }).catch((error) => {
                        return res.status(400).json({ success: false, message: "Unable to full fill your order", reason: error })
                    })

                } else {
                    console.log("Unknow order type");
                    return res.status(400).json({ success: false, message: `Order type ${orderType} is not allowed` })
                }
                break

            default:
                console.log("Unknow event received");
                throw new Error(`Event type ${eventType} is not allowed`)
        }
    })
}