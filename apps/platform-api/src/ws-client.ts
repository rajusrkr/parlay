import WebSocket from "ws";

export const  ws: WebSocket = new WebSocket("ws://localhost:8001")

export const pendingRequests = new Map<string, {resolve: (data: any) => void; reject: (err: any) => any}>()
