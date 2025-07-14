import WebSocket from "ws";
import { wsPort } from "shared/dist/index"

export const  ws: WebSocket = new WebSocket(`ws://localhost:${wsPort}`)

export const pendingRequests = new Map<string, {resolve: (data: any) => void; reject: (err: any) => any}>()
