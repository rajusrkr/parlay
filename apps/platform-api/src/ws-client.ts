import WebSocket from "ws";
import jwt from "jsonwebtoken"

let ws: WebSocket;

export function connectToWsServer(){
    return new Promise<void>((resolve, reject) => {
        // generate token
        const token = jwt.sign({role: "platform-api"}, `${process.env.JWT_SECRET}`)
        // provide url
        ws = new WebSocket("ws://localhost:8001")
        // on open
        ws.on("open", () => {
            ws.send(JSON.stringify({ token }))
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