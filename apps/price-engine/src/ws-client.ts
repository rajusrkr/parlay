import WebSocket from "ws";
import { handleWsMessage } from "./ws/handle-messages";
import { wsPort } from "shared/dist/index";

export const  ws: WebSocket = new WebSocket(`ws://localhost:${wsPort}`)

handleWsMessage()

