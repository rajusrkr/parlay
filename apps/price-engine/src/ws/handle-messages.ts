import { NSBOCalculation } from "../lmsr/nsbo-calculation";
import { NSSOCalculation } from "../lmsr/nsso.calculation";
import { YSBOCalculations } from "../lmsr/ysbo-calculation";
import { YSSOCalculations } from "../lmsr/ysso-calculation";
import { ws } from "../ws-client";
import { BuyOrderUpdates, SellOrderUpdates, WsPayload } from "shared/dist/index";

export function handleWsMessage(): Promise<any> {
  return new Promise((resolve, reject) => {
    ws.on("message", (msg) => {
      const parsed = JSON.parse(msg.toString());
      console.log(parsed);
      

      // for auth message
      if (parsed.wsMessageData.eventName === "auth-success") {
        console.log(`Connection established with ws-server`);
      }
      // for new order received
      if (parsed.wsMessageData.eventName === "new-order") {
        const data = parsed.wsMessageData.data;
        const requestId = parsed.wsMessageData.requestId;

        if (data.orderSide === "yes" && data.orderType === "buy") {
          // place here the yes side buy order func
          const priceUpdate: BuyOrderUpdates = YSBOCalculations({
            totalYesQty: data.prevYesSideQty,
            totalNoQty: data.prevNoSideQty,
            b: 1000,
            userQty: data.userOrderQty,
            requestId: requestId,
          });

          const wsData: WsPayload = {
            eventType: "PRICE_UPDATE",
            data: {
              yesPriceBeforeOrder: priceUpdate.yesPriceBeforeOrder,
              noPriceBeforeOrder: priceUpdate.noPriceBeforeOrder,
              yesPriceAftereOrder: priceUpdate.yesPriceAftereOrder,
              noPriceAfterOrder: priceUpdate.noPriceAfterOrder,
              costBeforeOrder: priceUpdate.costBeforeOrder,
              costAfterOrder: priceUpdate.costAfterOrder,
              costToUser: priceUpdate.costToUser,
              requestId: priceUpdate.requestId
            },
          };

          ws.send(JSON.stringify(wsData));

          resolve(wsData);
          return;
        }

        if (data.orderSide === "yes" && data.orderType === "sell") {
          // place the yes side sell func
          const priceUpdate: SellOrderUpdates = YSSOCalculations({
            totalYesQty: data.prevYesSideQty,
            totalNoQty: data.prevNoSideQty,
            b: 1000,
            userQty: data.userOrderQty,
            requestId: requestId,
          });

          const wsData: WsPayload = {
            eventType: "PRICE_UPDATE",
            data: {
              yesPriceBeforeOrder: priceUpdate.yesPriceBeforeOrder,
              noPriceBeforeOrder: priceUpdate.noPriceBeforeOrder,
              yesPriceAftereOrder: priceUpdate.yesPriceAftereOrder,
              noPriceAfterOrder: priceUpdate.noPriceAfterOrder,
              costBeforeOrder: priceUpdate.costBeforeOrder,
              costAfterOrder: priceUpdate.costAfterOrder,
              returnToUser: priceUpdate.returnToUser,
              requestId: priceUpdate.requestId
            },
          };

          ws.send(JSON.stringify(wsData));
          resolve(wsData);
          return;
        }

        if (data.orderSide === "no" && data.orderType === "buy") {
          const priceUpdate: BuyOrderUpdates = NSBOCalculation({
            totalYesQty: data.prevYesSideQty,
            totalNoQty: data.prevNoSideQty,
            b: 1000,
            userQty: data.userOrderQty,
            requestId: requestId,
          });

          const wsData: WsPayload = {
            eventType: "PRICE_UPDATE",
            data: {
              yesPriceBeforeOrder: priceUpdate.yesPriceBeforeOrder,
              noPriceBeforeOrder: priceUpdate.noPriceBeforeOrder,
              yesPriceAftereOrder: priceUpdate.yesPriceAftereOrder,
              noPriceAfterOrder: priceUpdate.noPriceAfterOrder,
              costBeforeOrder: priceUpdate.costBeforeOrder,
              costAfterOrder: priceUpdate.costAfterOrder,
              costToUser: priceUpdate.costToUser,
              requestId: priceUpdate.requestId
            },
          };

          ws.send(JSON.stringify( wsData ));
          resolve(wsData);
          return;
        }

        if (data.orderSide === "no" && data.orderType === "sell") {
          const priceUpdate: SellOrderUpdates = NSSOCalculation({
            totalYesQty: data.prevYesSideQty,
            totalNoQty: data.prevNoSideQty,
            b: 1000,
            userQty: data.userOrderQty,
            requestId: requestId,
          });

         const wsData: WsPayload = {
            eventType: "PRICE_UPDATE",
            data: {
              yesPriceBeforeOrder: priceUpdate.yesPriceBeforeOrder,
              noPriceBeforeOrder: priceUpdate.noPriceBeforeOrder,
              yesPriceAftereOrder: priceUpdate.yesPriceAftereOrder,
              noPriceAfterOrder: priceUpdate.noPriceAfterOrder,
              costBeforeOrder: priceUpdate.costBeforeOrder,
              costAfterOrder: priceUpdate.costAfterOrder,
              returnToUser: priceUpdate.returnToUser,
              requestId: priceUpdate.requestId
            },
          };

          ws.send(JSON.stringify({ wsData }));
          resolve(wsData);
          return;
        }
      }
    });
  });
}
