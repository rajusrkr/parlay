import { wsPacket } from "shared/dist/index";
import { ws } from "../ws-client";

export function sendOrderToWsServer(wsData: wsPacket) {
  ws.send(JSON.stringify({ wsData }));
}
