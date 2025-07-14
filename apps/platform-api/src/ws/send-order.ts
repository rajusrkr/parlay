import { WsPayload } from "shared/dist/index";
import { ws } from "../ws-client";

export function sendOrderToWsServer(wsData: WsPayload) {
  ws.send(JSON.stringify( wsData ));
}
