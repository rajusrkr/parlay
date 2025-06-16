import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken"
import dotnenv from "dotenv"

dotnenv.config()

interface ExtendedWebsocket extends WebSocket {
    isAlive?: boolean;
    role?: string
}


const wss = new WebSocketServer({port: 8001})

const JWT_SECRET = process.env.JWT_SECRET;

console.log(`[WS] server runninf on port 8001`);

wss.on("connection", (ws: ExtendedWebsocket) => {
    console.log(`[WS] New client connected`);
    

    ws.on("error", (error) => {
        console.error(`[WS] Error:`, error)
    })

    // handling incoming messges
    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString())

            if (message.token) {
                try {
                    const decode: any = jwt.verify(message.token, JWT_SECRET!)
                    ws.role = decode.role

                    console.log(`[WS] Authenticated as: ${ws.role}`);
                    ws.send(JSON.stringify({type: "auth_success", role: ws.role}))
                    return
                } catch (error) {
                    console.log(error);
                    ws.send(JSON.stringify({type: "auth_failed", error: "Invalid token"}))
                    ws.close()
                    return
                }
            }

            if (!ws.role) {
                ws.send(JSON.stringify({type: "unauthorized"}))
                ws.close()
                return
            }
        } catch (error) {
            
        }
    })
})
