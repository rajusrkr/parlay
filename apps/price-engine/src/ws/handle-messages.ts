import { NSBOCalculation } from "../lmsr/nsbo-calculation";
import { NSSOCalculation } from "../lmsr/nsso.calculation";
import { YSBOCalculations } from "../lmsr/ysbo-calculation";
import { YSSOCalculations } from "../lmsr/ysso-calculation";
import { BuyOrderUpdates, SellOrderUpdates, WsPayload } from "shared/dist/index";
import { ws } from "../ws-client";

export function handleWsMessage(): Promise<any> {
  return new Promise((resolve, reject) => {
    ws.on("message", (msg) => {
      const parsedMessage = JSON.parse(msg.toString());
      
      const {eventType,requestId, data} = parsedMessage
      const {userOrderSide, userOrderType, userOrderQty, prevYesSideQty, prevNoSideQty} = data;

      // for auth message
      if (eventType === "authAck") {
       console.log('Event type:', eventType); 
       console.log('Message:', data.message);
      }
      // for new order received
      if (eventType === "newOrder") {
        if (userOrderSide === "yes" && userOrderType === "buy") {
          // place here the yes side buy order func
          const priceUpdate: BuyOrderUpdates = YSBOCalculations({
            totalYesQty: prevYesSideQty,
            totalNoQty: prevNoSideQty,
            b: 1000,
            userQty: userOrderQty,
            requestId,
          });

          const wsData: WsPayload = {
            eventType: "priceUpdate",
            requestId: priceUpdate.requestId,
            data: {
              yesPriceBeforeOrder: priceUpdate.yesPriceBeforeOrder,
              noPriceBeforeOrder: priceUpdate.noPriceBeforeOrder,
              yesPriceAftereOrder: priceUpdate.yesPriceAftereOrder,
              noPriceAfterOrder: priceUpdate.noPriceAfterOrder,
              costBeforeOrder: priceUpdate.costBeforeOrder,
              costAfterOrder: priceUpdate.costAfterOrder,
              costToUser: priceUpdate.costToUser,
            },
          };

          ws.send(JSON.stringify(wsData));

          resolve(wsData);
          return;
        } else if (userOrderSide === "yes" && userOrderType === "sell") {
          // place the yes side sell func
          const priceUpdate: SellOrderUpdates = YSSOCalculations({
            totalYesQty: prevYesSideQty,
            totalNoQty: prevNoSideQty,
            b: 1000,
            userQty: userOrderQty,
            requestId,
          });

          const wsData: WsPayload = {
            eventType: "priceUpdate",
            requestId: priceUpdate.requestId,
            data: {
              yesPriceBeforeOrder: priceUpdate.yesPriceBeforeOrder,
              noPriceBeforeOrder: priceUpdate.noPriceBeforeOrder,
              yesPriceAftereOrder: priceUpdate.yesPriceAftereOrder,
              noPriceAfterOrder: priceUpdate.noPriceAfterOrder,
              costBeforeOrder: priceUpdate.costBeforeOrder,
              costAfterOrder: priceUpdate.costAfterOrder,
              returnToUser: priceUpdate.returnToUser,
            },
          };

          ws.send(JSON.stringify(wsData));
          resolve(wsData);
          return;
        }

        if (userOrderSide === "no" && userOrderType === "buy") {
          const priceUpdate: BuyOrderUpdates = NSBOCalculation({
            totalYesQty: prevYesSideQty,
            totalNoQty: prevNoSideQty,
            b: 1000,
            userQty: userOrderQty,
            requestId,
          });

          const wsData: WsPayload = {
            eventType: "priceUpdate",
            requestId: priceUpdate.requestId,
            data: {
              yesPriceBeforeOrder: priceUpdate.yesPriceBeforeOrder,
              noPriceBeforeOrder: priceUpdate.noPriceBeforeOrder,
              yesPriceAftereOrder: priceUpdate.yesPriceAftereOrder,
              noPriceAfterOrder: priceUpdate.noPriceAfterOrder,
              costBeforeOrder: priceUpdate.costBeforeOrder,
              costAfterOrder: priceUpdate.costAfterOrder,
              costToUser: priceUpdate.costToUser,
            },
          };

          ws.send(JSON.stringify( wsData ));
          resolve(wsData);
          return;
        }

        if (userOrderSide === "no" && userOrderType === "sell") {
          const priceUpdate: SellOrderUpdates = NSSOCalculation({
            totalYesQty: prevYesSideQty,
            totalNoQty: prevNoSideQty,
            b: 1000,
            userQty: userOrderQty,
            requestId,
          });

         const wsData: WsPayload = {
            eventType: "priceUpdate",
            requestId: priceUpdate.requestId,
            data: {
              yesPriceBeforeOrder: priceUpdate.yesPriceBeforeOrder,
              noPriceBeforeOrder: priceUpdate.noPriceBeforeOrder,
              yesPriceAftereOrder: priceUpdate.yesPriceAftereOrder,
              noPriceAfterOrder: priceUpdate.noPriceAfterOrder,
              costBeforeOrder: priceUpdate.costBeforeOrder,
              costAfterOrder: priceUpdate.costAfterOrder,
              returnToUser: priceUpdate.returnToUser,
            },
          };

          ws.send(JSON.stringify({ wsData }));
          resolve(wsData);
          return;
        }
      }
    });

    ws.on("ping", () => {
      console.log("Received ping, sending pong...🚀");
    })
    
  });
}

