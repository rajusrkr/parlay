import { wsSend } from "shared/dist/index";
import { ws } from "../ws-client";

export function sendOrderToWsServer(wsData: wsSend) {
  ws.send(JSON.stringify({ wsData }));
}
