import { WsPayload } from "types/src/index";
import { buySellShare } from "../lmsr/lmsrfunction";
import { ws } from "../ws-client";

export function handleWsEvents(): Promise<any> {
  return new Promise((resolve, reject) => {
    ws.on("message", (msg) => {

      // Parse the message
      const parsedMessage = JSON.parse(msg.toString());


      const { eventType, requestId, data } = parsedMessage
      // Extract fields from data
      const { votedOutcomeIndex, orderType, qty, outcomes } = data;
      console.log(data);
      

      // Switch case implementation for different events
      switch (eventType) {
        // Auth event
        case "authAck":
          console.log("Event type:", eventType);
          console.log("Message:", data.message);
          break
        // New order event
        case "newOrder":
          // Liquidity parameter
          console.log(parsedMessage.data.outcomes);
          
          const b = 1000;

          // Get the calculated price
          // Prepare update object
          // Send the update object
          if (orderType === "buy") {
            const { calculatedOutcome, tradeCost } = buySellShare({ b, orderType, outcomeIndex: votedOutcomeIndex, outcomes, qty })
            console.log(tradeCost);
            

            const update: WsPayload = {
              eventType: "priceUpdate",
              requestId,
              data: {
                tradeCost,
                outcomes: calculatedOutcome,
                votedOutcomeIndex,
                orderType,
                qty
              }
            }
            ws.send(JSON.stringify(update))
            resolve(update)
            return
          } else if (orderType === "sell") {
            const { calculatedOutcome, returnToUser } = buySellShare({ b, orderType, outcomeIndex: votedOutcomeIndex, outcomes, qty })

            const update: WsPayload = {
              eventType: "priceUpdate",
              requestId,
              data: {
                returnToUser,
                outcomes: calculatedOutcome,
                votedOutcomeIndex,
                orderType,
                qty
              }
            }

            ws.send(JSON.stringify(update))
            resolve(update)

          } else {
            console.log(`Unknow order type received ${orderType}`);
            throw new Error(`Order type ${orderType} is not allowed`)
          }

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

