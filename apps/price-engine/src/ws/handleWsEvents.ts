import { buyOrderlmsrCalculationInterfaceData, newBetData, sellOrderlmsrCalculationInterfaceData, wsData, WsPayload } from "@repo/shared/dist/src";
import { ws } from "./wsConnection";
import { buySellShare } from "../lmsr/lmsrFunction";
// import {type newBetPayload} from "@repo/shared/dist/src"

export function handleWsEvents(): Promise<any> {
  return new Promise((resolve, reject) => {
    ws.on("message", (msg) => {
      // Parse the message
      const parsedMessage = JSON.parse(msg.toString());
      console.log(parsedMessage);


      const { eventType, data } = parsedMessage as wsData;

      // Switch case implementation for different events
      switch (eventType) {
        // Auth event
        case "authAck":
          console.log("Event type:", eventType);
          break
        // New buy bet
        case "newBuyBet":
          const { betId, betQty, betType, outcomes, selectedOutcomeIndex } = data as newBetData;
          // Liquidity parameter
          const b = 1000;
          const { calculatedOutcome, tradeCost } = buySellShare({ b, orderType: betType, outcomeIndex: selectedOutcomeIndex, outcomes: outcomes, qty: betQty })
          const socketPayload: wsData = {
            eventType: "lmsrBuyCalculation",
            data: {
              betCost: tradeCost,
              betId,
              betQty,
              betType,
              outcome: calculatedOutcome
            } as buyOrderlmsrCalculationInterfaceData
          }
          // Send the socket payload
          ws.send(JSON.stringify(socketPayload))
          resolve(socketPayload)
          break

        default:
          console.log("Unknown event type received.");
          throw new Error(`Unknown event type received. Event ${eventType}`)

      }
    });

    ws.on("ping", () => {
      console.log("Received ping, sending pong...🚀");
    })

  });
}

