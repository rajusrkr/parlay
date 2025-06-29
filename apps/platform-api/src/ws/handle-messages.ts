import { ws } from "../ws-client";
import { pendingRequests } from "../controllers/order.controller"

export function handleWsMessage() {
  ws.on("message", (msg) => {
    const parsed = JSON.parse(msg.toString());
    const {messageEvent, data} = parsed.wsMessageData
    
    // if auth response 
    if (messageEvent === "auth-success") {
      console.log(`[AUTH]: ${messageEvent}, and role ${data.role}`);
      return 
    }

    if (messageEvent === "price-update") {
      console.log(`[PRICE UPDATE]`);
      console.log(data);
    }
    
  });
}
