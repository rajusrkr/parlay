import { ws } from "../ws-client";
import { pendingRequests } from "../controllers/order.controller";
import { db } from "../db/dbConnection";
import { marketTable, orderTable, priceData, usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export function handleWsMessage() {
  ws.on("message", async (msg) => {
    const parsed = JSON.parse(msg.toString());
    const { eventName, data } = parsed.wsMessageData;

    let errosMessage;
    let errorStatusCode;

    // if auth response
    if (eventName === "auth-success") {
      console.log(`[AUTH]: ${eventName}, and role ${data.role}`);
      return;
    }

    // if price update
    if (eventName === "price-update") {
      console.log(`[PRICE UPDATE RECEIVED]`);

      const pending = pendingRequests.get(data.requestId);

      if (!pending) return;

      try {
        /*
        - here i have to perform db operation according to:
          - order-type
          - order-side

          tables that will be affected:
          - markets [update the qty]
          - orders [new order entry]
          - priceData [new price data entry]
          - users [deduct balance from user]


        here i need to perform a transaction that will update
        those four tables or will rollback.

        i have to check here 
          - is the order is sell or buy order 
          - is the order for yes side or no side
        */

        // yes side buy order
        if (pending.orderSide === "yes" && pending.orderType === "buy") {
          try {
            await db.transaction(async (tx) => {
              const [account] = await tx
                .select()
                .from(usersTable)
                .where(eq(usersTable.userId, pending.userId));

              if (Number(account.userWalletBalance) < data.costToUser) {
                throw new Error("Insifficient balance");
              }

              const dbBalance = Number(account.userWalletBalance);
              const cost = data.costToUser;
              const newBalance = dbBalance - cost;

              // here i need to deduct the balance => done
              // create the order in the orders table => done
              // update market qty => done
              // update the price data => done

              await tx
                .update(usersTable)
                .set({
                  userWalletBalance: newBalance.toString(),
                })
                .where(eq(usersTable.userId, pending.userId));

              const order = await tx
                .insert(orderTable)
                .values({
                  executionPrice: (
                    data.costToUser / pending.userOrderQty
                  ).toString(),
                  orderId: data.requestId,
                  orderPlacedBy: pending.userId,
                  qty: pending.userOrderQty,
                  sideTaken: pending.orderSide,
                  orderType: pending.orderType,
                  marketId: pending.marketId,
                  yesPriceAfterOrder: data.yesPriceAftereOrder,
                  noPriceAfterOrder: data.noPriceAfterOrder,
                })
                .returning();

              const userQty = pending.userOrderQty;

              const [market] = await tx
                .select()
                .from(marketTable)
                .where(eq(marketTable.marketId, pending.marketId));

              const newTotalQty = userQty + market.totalYesQty;
              await tx
                .update(marketTable)
                .set({
                  totalYesQty: newTotalQty,
                  lastUpdatedYesPrice: data.yesPriceAftereOrder,
                  lastUpdatedNoPrice: data.noPriceAfterOrder,
                })
                .where(eq(marketTable.marketId, pending.marketId));

              await tx.insert(priceData).values({
                noSidePrice: data.noPriceAfterOrder,
                yesSidePrice: data.yesPriceAftereOrder,
                marketId: pending.marketId,
              });
              // send repsne to client
              ws.send(
                JSON.stringify({
                  eventName: "confirm-price-update",
                  message: "hey there new price",
                  yesPrice: data.yesPriceAftereOrder,
                  noPrice: data.noPriceAfterOrder,
                  marketId: pending.marketId,
                  time: order[0].createdOn,
                })
              );
            });
            pending.res.status(200).json({
              success: true,
              message: "Order has been placed successfully",
            });
          } catch (error) {
            pending.res.status(500).json({
              success: false,
              message:
                "Unable to perform the transactions, Internal server error",
            });
          }
        }

        // yes side sell order
        if (pending.orderSide === "yes" && pending.orderType === "sell") {
          /*
          first check if the yes side order exists in users order => done
          if not exists return error => done
          else
          get the amount and add that amount to users =>
          minus the totalqtyYesSide from market Table => done
          add entry to the orders table
          */

          try {
            await db.transaction(async (tx) => {
              const order = await tx
                .select()
                .from(orderTable)
                .where(eq(orderTable.orderPlacedBy, pending.userId));
              if (order.length === 0) {
                tx.rollback();
              }

              const userAccount = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.userId, pending.userId));
              const market = await db
                .select()
                .from(marketTable)
                .where(eq(marketTable.marketId, pending.marketId));

              const userBalance = Number(userAccount[0].userWalletBalance);
              const returnBalance = data.returnToUser;
              const newBalance = userBalance + returnBalance;

              const marketYesQty = market[0].totalYesQty;
              const userQty = pending.userOrderQty;
              const newQty = marketYesQty - userQty;

              await tx
                .update(usersTable)
                .set({
                  userWalletBalance: newBalance.toString(),
                })
                .where(eq(usersTable.userId, pending.userId));

              await tx
                .update(marketTable)
                .set({
                  totalYesQty: newQty,
                  lastUpdatedYesPrice: data.yesPriceAftereOrder,
                  lastUpdatedNoPrice: data.noPriceAfterOrder,
                })
                .where(eq(marketTable.marketId, pending.marketId));

              const createOrder = await tx
                .insert(orderTable)
                .values({
                  executionPrice: (
                    data.returnToUser / pending.userOrderQty
                  ).toString(),
                  orderId: data.requestId,
                  orderPlacedBy: pending.userId,
                  qty: pending.userOrderQty,
                  sideTaken: pending.orderSide,
                  orderType: pending.orderType,
                  marketId: pending.marketId,
                  yesPriceAfterOrder: data.yesPriceAftereOrder,
                  noPriceAfterOrder: data.noPriceAfterOrder,
                })
                .returning();
              ws.send(
                JSON.stringify({
                  eventName: "confirm-price-update",
                  message: "hey there new price",
                  yesPrice: data.yesPriceAftereOrder,
                  noPrice: data.noPriceAfterOrder,
                  marketId: pending.marketId,
                  time: createOrder[0].createdOn,
                })
              );
            });

            pending.res.status(200).json({
              success: true,
              message: "Order has been placed",
            });
          } catch (error) {
            console.error(error);
            pending.res.status(500).json({
              success: false,
              message: "Unable to perform transactions, Internal server error",
            });
          }
        }

        // no side buy order
        if (pending.orderSide === "no" && pending.orderType === "buy") {
          /*
            - deduct the balance => done
            - update market no side qty => done
            - create the order => done
            - update price => done

            
          */

          console.log(data);

          try {
            await db.transaction(async (tx) => {
              const [account] = await tx
                .select()
                .from(usersTable)
                .where(eq(usersTable.userId, pending.userId));
              if (Number(account.userWalletBalance) < data.costToUser) {
                errosMessage = "Insuffiecient balance";
                errorStatusCode = 400;
                tx.rollback();
              }

              const dbBalance = Number(account.userWalletBalance);
              const userCosts = data.costToUser;
              const newBalance = dbBalance - userCosts;

              const market = await db
                .select()
                .from(marketTable)
                .where(eq(marketTable.marketId, pending.marketId));
              const noQtyBefore = market[0].totalNoQty;
              const userQty = pending.userOrderQty;
              const newQty = noQtyBefore + userQty;

              await tx
                .update(usersTable)
                .set({
                  userWalletBalance: newBalance.toString(),
                })
                .where(eq(usersTable.userId, pending.userId));

              await tx
                .update(marketTable)
                .set({
                  totalNoQty: newQty,
                  lastUpdatedYesPrice: data.yesPriceAftereOrder,
                  lastUpdatedNoPrice: data.noPriceAfterOrder,
                })
                .where(eq(marketTable.marketId, pending.marketId));

              const order = await tx
                .insert(orderTable)
                .values({
                  orderId: data.requestId,
                  qty: pending.userOrderQty,
                  sideTaken: pending.orderSide,
                  orderType: pending.orderType,
                  executionPrice: (
                    data.costToUser / pending.userOrderQty
                  ).toString(),
                  orderPlacedBy: pending.userId,
                  marketId: pending.marketId,
                  yesPriceAfterOrder: data.yesPriceAftereOrder,
                  noPriceAfterOrder: data.noPriceAfterOrder,
                })
                .returning();

              await tx.insert(priceData).values({
                noSidePrice: data.noPriceAfterOrder,
                yesSidePrice: data.yesPriceAftereOrder,
                marketId: pending.marketId,
              });

              ws.send(
                JSON.stringify({
                  eventName: "confirm-price-update",
                  message: "hey there new price",
                  yesPrice: data.yesPriceAftereOrder,
                  noPrice: data.noPriceAfterOrder,
                  marketId: pending.marketId,
                  time: order[0].createdOn,
                })
              );
            });
            pending.res
              .status(200)
              .json({ success: true, message: "Order has been placed" });
          } catch (error) {
            console.error(error);
            pending.res.status(errorStatusCode!).json({
              success: false,
              message: "Unable to perform transactions, Internal server error",
              reason: errosMessage,
            });
          }
        }

        // no side sell order
        if (pending.orderSide === "no" && pending.orderType === "sell") {
          /*
            - i have to add balance to user's account => done
            - update the market table => done
            - create an order => done
            - price update => done
          */

          try {
            await db.transaction(async (tx) => {
              const userAccount = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.userId, pending.userId));
              const market = await db
                .select()
                .from(marketTable)
                .where(eq(marketTable.marketId, pending.marketId));

              const returnBalance = data.returnToUser;
              const newBalance =
                Number(userAccount[0].userWalletBalance) + returnBalance;

              const noQty = market[0].totalNoQty;
              const userQty = pending.userOrderQty;
              const newQty = noQty - userQty;

              await tx
                .update(usersTable)
                .set({
                  userWalletBalance: newBalance.toString(),
                })
                .where(eq(usersTable.userId, pending.userId));

              await tx
                .update(marketTable)
                .set({
                  totalNoQty: newQty,
                  lastUpdatedYesPrice: data.yesPriceAftereOrder,
                  lastUpdatedNoPrice: data.noPriceAfterOrder,
                })
                .where(eq(marketTable.marketId, pending.marketId));

              const order = await tx
                .insert(orderTable)
                .values({
                  orderId: data.requestId,
                  sideTaken: pending.orderSide,
                  orderType: pending.orderType,
                  qty: pending.userOrderQty,
                  executionPrice: (
                    data.returnToUser / pending.userOrderQty
                  ).toString(),
                  orderPlacedBy: pending.userId,
                  marketId: pending.marketId,
                  yesPriceAfterOrder: data.yesPriceAftereOrder,
                  noPriceAfterOrder: data.noPriceAfterOrder,
                })
                .returning();

              await tx.update(priceData).set({
                marketId: pending.marketId,
                noSidePrice: data.noPriceAfterOrder,
                yesSidePrice: data.yesPriceAftereOrder,
              });

              ws.send(
                JSON.stringify({
                  eventName: "confirm-price-update",
                  message: "hey there new price",
                  yesPrice: data.yesPriceAftereOrder,
                  noPrice: data.noPriceAfterOrder,
                  marketId: pending.marketId,
                  time: order[0].createdOn,
                })
              );
            });
            pending.res
              .status(200)
              .json({ success: true, message: "Order has been placed" });
          } catch (error) {
            console.error(error);
            pending.res.status(500).json({
              success: false,
              message: "Unable to perform transactions. Internal server error",
            });
          }
        }
      } catch (error) {
        console.error(`DB update failed after WS response`, error);
        pending.res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      } finally {
        pendingRequests.delete(data.requestId);
      }
    }
  });
}
