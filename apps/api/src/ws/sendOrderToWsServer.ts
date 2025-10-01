import { WsPayload } from "@repo/shared/dist/src"
import { ws } from "./wsConnection";

export function sendOrderToWsServer(wsData: WsPayload) {
  ws.send(JSON.stringify(wsData));
}
