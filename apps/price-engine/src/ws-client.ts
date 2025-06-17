import WebSocket from "ws";
import jwt from "jsonwebtoken"

let ws: WebSocket

export function connectToWsServer(){
    return new Promise<void>((resolve,reject) => {

        // generating the token with role
        const token = jwt.sign({clientRole: "price-engine"}, `${process.env.JWT_SECRET}`)
        // url to connect
        ws = new WebSocket("ws://localhost:8001")
        // on connection open send token
        ws.on("open", () => {
            ws.send(JSON.stringify({token}))

            console.log(`[WS] connected as price-engine`);

            resolve()
            
        })
        // on receiving message from ws-server
        ws.on("message", (msg) => {
            const data = JSON.parse(msg.toString())

            console.log(`[WS] Message:`, data);
            
        })
        //  on error
        ws.on("error", reject)
    })
}