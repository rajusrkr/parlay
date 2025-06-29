import { ws } from "../ws-client";
import { pendingRequests } from "../controllers/order.controller"

export function handleWsMessage() {
  ws.on("message", (msg) => {
    const parsed = JSON.parse(msg.toString());
    const {eventName, data} = parsed.wsMessageData
    
    // if auth response 
    if (eventName === "auth-success") {
      console.log(`[AUTH]: ${eventName}, and role ${data.role}`);
      return 
    }

    if (eventName === "price-update") {
      console.log(`[PRICE UPDATE]`);
      console.log(data);
    }
    
  });
}
