import { ws } from "../ws-client";
import { pendingRequests } from "../controllers/order.controller"
import { db } from "../db/dbConnection";
import { marketTable, orderTable, priceData, usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

export function handleWsMessage() {
  ws.on("message", async (msg) => {
    const parsed = JSON.parse(msg.toString());
    const {eventName, data} = parsed.wsMessageData
    
    // if auth response 
    if (eventName === "auth-success") {
      console.log(`[AUTH]: ${eventName}, and role ${data.role}`);
      return 
    }

    if (eventName === "price-update") {
      console.log(`[PRICE UPDATE RECEIVED]`);

      const pending = pendingRequests.get(data.requestId)

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
          await db.transaction(async (tx) => {
            const [account] = await tx.select().from(usersTable).where(eq(usersTable.userId, pending.userId))

            if (Number(account.userWalletBalance) < data.costToUser) {
              tx.rollback()
            }

            const dbBalance = Number(account.userWalletBalance);
            const cost = data.costToUser;
            const newBalance = dbBalance - cost
            
            // here i need to deduct the balance => done
            // create the order in the orders table => done
            // update market qty => done
            // update the price data
            
            await tx.update(usersTable).set({
              userWalletBalance: newBalance.toString()
            }).where(eq(usersTable.userId, pending.userId))
            

            await tx.insert(orderTable).values({
              executionPrice: (data.costToUser / pending.userOrderQty).toString(),
              orderId: data.requestId,
              orderPlacedBy: pending.userId,
              qty: pending.userOrderQty,
              sideTaken: pending.orderSide,
              orderType: pending.orderType,
              marketId: pending.marketId
            })


            const userQty = pending.userOrderQty

            const [market] = await tx.select().from(marketTable).where(eq(marketTable.marketId, pending.marketId))

            const newTotalQty = userQty + market.totalYesQty
            await tx.update(marketTable).set({
              totalYesQty: newTotalQty
            }).where(eq(marketTable.marketId, pending.marketId))

            await tx.insert(priceData).values({
              noSidePrice: data.noPriceAfterOrder,
              yesSidePrice: data.yesPriceAftereOrder,
              marketId: pending.marketId
            })
          })

          pending.res.status(200).json({success: true, message: "Order has been placed successfully"})
        }

        // yes side sell order
        if (pending.orderSide === "yes" && pending.orderType === "sell") {
          /*
          first check if the yes side order exists in user orders
          if not exists return error
          else
          add the amount to user wallet

          

          */

          console.log(data);
          
        }


        

      } catch (error) {
        console.error(`DB update failed after WS response`, error)  
        pending.res.status(500).json({success: false, message: "Internal server error"})
      } finally {
        pendingRequests.delete(data.requestId)
      }
    }
    
  });
}
