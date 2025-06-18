import WebSocket from "ws";
import jwt from "jsonwebtoken"
import { wsData } from "shared/dist/index"

export let ws: WebSocket;

export function connectToWsServer(){
    return new Promise<void>((resolve, reject) => {
        // generate token
        const token = jwt.sign({clientRole: "platform-api"}, `${process.env.JWT_SECRET}`)
        // provide url
        ws = new WebSocket("ws://localhost:8001") 
        const wsData: wsData = {event: "handShake", data: {token}} 
        // on open
        ws.on("open", () => {
           
            ws.send(JSON.stringify({ wsData }))
            console.log("[WS] connected as platform-api");
            resolve()
        })
        // on incoming messages
        ws.on("message", (msg) => {
            const data = JSON.parse(msg.toString())
            console.log("[WS] Message:", data);
            
        })
        // on error
        ws.on("error", reject)
    })
}