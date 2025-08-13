import { ws } from "../ws-client";
import { WsPayload } from "types/src/index"

export function sendOrderToWsServer(wsData: WsPayload) {
  ws.send(JSON.stringify(wsData));
}
