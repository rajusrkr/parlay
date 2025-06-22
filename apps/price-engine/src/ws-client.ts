import WebSocket from "ws";
import { handleWsMessage } from "./ws/handle-messages";

export const  ws: WebSocket = new WebSocket("ws://localhost:8001")



handleWsMessage()

