import WebSocket from "ws";
// import { wsPort } from "shared/src/index";

export const  ws: WebSocket = new WebSocket(`ws://localhost:${8001}`)
