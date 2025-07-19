import WebSocket from "ws";
import { wsPort } from "shared/dist/index";

export const  ws: WebSocket = new WebSocket(`ws://localhost:${wsPort}`)
