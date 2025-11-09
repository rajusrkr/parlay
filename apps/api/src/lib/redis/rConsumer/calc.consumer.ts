import { db, market, order, position, user } from "@repo/db/dist/src";
import { redis } from "../redisClient";
import { and, avg, eq } from "drizzle-orm"
import { validateLMSRCalculations, fullOrderValidation } from "@repo/shared/dist/src"
import { type OrderStatus, orderStatus } from "../rProducer/order.producer";
import { PVBUpdate } from "../rProducer/price.producer";
async function calConsume() {
    const group = "api-server";
    const consumer = "api-server-cons";
    const stream = "order:calc";

    try {
        await redis.xgroup("CREATE", stream, group, "$", "MKSTREAM")
    } catch (error) {
        console.log(error);
    }

    while (true) {
        const res = await redis.xreadgroup("GROUP", group, consumer, "BLOCK", 5000, "STREAMS", stream, ">");
        if (!res) {
            continue;
        }
        processMessage({ orderData: res })
    }
}

async function processMessage({ orderData }: { orderData: any }) {
    const calculations: Record<string, any> = {}

    for (const [_, fields] of orderData) {
        for (const [_, cals] of fields) {
            for (let i = 0; i < cals.length; i += 2) {
                const key = cals[i]
                const data = cals[i + 1]
                calculations[key] = JSON.parse(data);
            }
        }
    }

    const { success, data, error } = validateLMSRCalculations.safeParse(calculations.orderCals)

    if (!success) {
        console.log("cal error");

        console.log(error);
        return
    }

    const findOrderById = await redis.hgetall(`order:${data!.orderId}`)
    const parsedOrder = JSON.parse(findOrderById.data)

    const validateParsedOrder = fullOrderValidation.safeParse(parsedOrder);

    if (!validateParsedOrder.success) {
        console.log("full order error");
        console.log(validateParsedOrder.error);
        return
    }

    const mergedData = {
        ...data, ...validateParsedOrder.data
    }

    // DB transactions
    try {
        // 1. Checking market
        const marketDetails = await db.select().from(market).where(and(
            eq(market.currentStatus, "open"),
            eq(market.marketId, mergedData.marketId)
        ))
        if (!marketDetails) {
            console.log("No market details found");
            return
        }

        // 2. Checking user
        const [userDetails] = await db.select().from(user).where(eq(user.userId, mergedData.userId));
        if (!userDetails) {
            console.log("No user found");
            return
        }

        // 3. If buy order
        if (mergedData.betType === "buy") {
            console.log("going for buy order");

            // 4. Wallet balance things
            if (userDetails.walletBalance! < mergedData.tradeCost!) {
                console.log("Balance is not suffiecient for this order");
                return
            }
            const newWalletBalance = userDetails.walletBalance! - mergedData.tradeCost!;
            await db.update(user).set({
                walletBalance: newWalletBalance
            }).where(eq(user.userId, mergedData.userId))

            // 5. Checking prev positions
            const [prevPosition] = await db.select().from(position).where(and(
                eq(position.positionTakenBy, mergedData.userId),
                eq(position.positionTakenFor, mergedData.selectedOutcome),
                eq(position.positionTakenIn, mergedData.marketId)
            ))
            // 6. If prev position exists
            if (prevPosition) {
                const newQty = prevPosition.totalQtyAndAvgPrice.totalQty + mergedData.betQty;
                const newAtTotalCost = prevPosition.totalQtyAndAvgPrice.atTotalCost + mergedData.tradeCost!;
                const newAvgPrice = newAtTotalCost / newQty;
                await db.update(position).set({
                    totalQtyAndAvgPrice: {
                        atTotalCost: newAtTotalCost,
                        avgPrice: newAvgPrice,
                        totalQty: newQty
                    }
                }).where(and(
                    eq(position.positionTakenBy, mergedData.userId),
                    eq(position.positionTakenFor, mergedData.selectedOutcome),
                    eq(position.positionTakenIn, mergedData.marketId)
                ))
                // 7. Else create a new position
            } else {
                const avgPrice = mergedData.tradeCost! / mergedData.betQty
                await db.insert(position).values({
                    positionId: mergedData.orderId,
                    positionTakenBy: mergedData.userId,
                    positionTakenFor: mergedData.selectedOutcome,
                    positionTakenIn: mergedData.marketId,
                    totalQtyAndAvgPrice: {
                        totalQty: mergedData.betQty,
                        avgPrice,
                        atTotalCost: mergedData.tradeCost!,
                    },
                    pnL: 0
                })
            }

            // 8. Create order entry
            const avgPrice = mergedData.tradeCost! / mergedData.betQty
            await db.insert(order).values({
                orderId: mergedData.orderId,
                orderPlacedBy: mergedData.userId,
                orderQty: mergedData.betQty,
                orderTakenIn: mergedData.marketId,
                orderType: mergedData.betType,
                updatedPrices: mergedData.calculatedOutcome,
                averageTradedPrice: avgPrice,
                orderPlacedFor: mergedData.selectedOutcome,

            })

            // await db.update(market).set({
            //     outcomes: mergedData.calculatedOutcome
            // })
            console.log("Successfully performed buy transactions, sending order status");

            const orderStatusDetails: OrderStatus = {
                message: "Buy order completed successfully",
                orderId: mergedData.orderId,
                qty: mergedData.betQty,
                tradedPrice: mergedData.tradeCost! / mergedData.betQty
            }
            // await PVBUpdate({ pricesUpdateData: [{ price: 123, title: "dckkjh", totalActiveBet: 123, totalActiveVolume: 123, tradedQty: 123 }] })
            await orderStatus({ orderStatus: orderStatusDetails })
            console.log("sent order status");

            // 9. Sell order
        } else if (mergedData.betType === "sell") {
            // 10. Check if prev position exists
            const [prevPosition] = await db.select().from(position).where(and(
                eq(position.positionTakenIn, mergedData.marketId),
                eq(position.positionTakenBy, mergedData.userId),
                eq(position.positionTakenFor, mergedData.selectedOutcome)
            ))
            if (!prevPosition) {
                console.log("No position found");
                return
            }
            if (prevPosition.totalQtyAndAvgPrice.totalQty < mergedData.betQty) {
                console.log("Not enough qty to sell");
                return
            }

            // 11. Wallet things
            const newWalletBalance = userDetails.walletBalance! + mergedData.returnToUser!
            await db.update(user).set({
                walletBalance: newWalletBalance
            }).where(eq(user.userId, mergedData.userId))

            // 12. Position update
            const newQty = prevPosition.totalQtyAndAvgPrice.totalQty - mergedData.betQty;
            const newAvgPrice = prevPosition.totalQtyAndAvgPrice.avgPrice;
            const newAtTotalCost = newAvgPrice * newQty
            await db.update(position).set({
                totalQtyAndAvgPrice: {
                    totalQty: newQty,
                    avgPrice: newAvgPrice,
                    atTotalCost: newAtTotalCost
                }
            })

            // 13. Create new order
            function getSellOrderAvgPrice() {
                const avgPrice = mergedData.returnToUser! / mergedData.betQty;

                if (avgPrice < 0) {
                    const multiplyByMinusOne = -1
                    const positiveAvgPrice = avgPrice * multiplyByMinusOne;

                    return positiveAvgPrice
                }
                return avgPrice;
            }
            await db.insert(order).values({
                orderId: mergedData.orderId,
                orderPlacedBy: mergedData.userId,
                orderQty: mergedData.betQty,
                orderTakenIn: mergedData.marketId,
                orderType: mergedData.betType,
                updatedPrices: mergedData.calculatedOutcome,
                averageTradedPrice: getSellOrderAvgPrice(),
                orderPlacedFor: mergedData.selectedOutcome,

            })

            // await db.update(market).set({
            //     outcomes: mergedData.calculatedOutcome
            // })
            console.log("Successfully performed SELL transactions");

        } else {
            console.log("Unknow order type");
            return
        }




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

export { calConsume }