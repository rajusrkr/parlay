import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken"
import dotnenv from "dotenv"

dotnenv.config()

interface ExtendedWebsocket extends WebSocket {
    isAlive?: boolean;
    clientRole?: string
}

const clients = new Map<ExtendedWebsocket, string>();


const wss = new WebSocketServer({port: 8001})

const JWT_SECRET = process.env.JWT_SECRET;

console.log(`[WS] server running on port 8001`);

wss.on("connection", (ws: ExtendedWebsocket) => {
    console.log(`[WS] New client connected`);
    

    ws.on("error", (error) => {
        console.error(`[WS] Error:`, error)
    })

    ws.on("close", () => {
        console.log(`[WS] client disconnected: ${ws.clientRole}`);
        clients.delete(ws)
        logConnectedClients()
    })

    // handling incoming messges
    ws.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString())

            // FOR AUTH
            if (message.wsData.event === "handShake") {
                try {
                    const decode: any = jwt.verify(message.wsData.data.token, JWT_SECRET!)
                    
                    if (typeof decode !== "object" || !decode.clientRole) {
                        throw new Error("Invalid token payload")
                    }

                    ws.clientRole = decode.clientRole

                    console.log(`[WS] Authenticated as: ${ws.clientRole}`);
                    ws.send(JSON.stringify({type: "auth_success", role: ws.clientRole}))
                    clients.set(ws, ws.clientRole!)
                    logConnectedClients()
                    return
                } catch (error) {
                    console.log(error);
                    ws.send(JSON.stringify({type: "auth_failed", error: "Invalid token"}))
                    ws.close()
                    return
                }
            }
            // FOR SENDING ORDER-PLACED EVENT TO PRICE-ENGINE
            if (message.wsData.event === "order-placed") {
                console.log(`[WS] order-placed received from ${ws.clientRole}`);
                
                const orderPayload = message.wsData.data;

                // find client with "price-engine role"
                for(const [client, role] of clients.entries()) {
                    if (role === "price-engine" && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            event: "order-placed",
                            orderDetails: orderPayload
                        }))
                    }
                }
            }

            if (!ws.clientRole) {
                ws.send(JSON.stringify({type: "unauthorized"}))
                ws.close()
                logConnectedClients()
                return
            }
        } catch (error) {
            
        }
    })
})



function logConnectedClients(){
    console.log('[WS] Connected clients');
    clients.forEach((role, client) => {
        console.log(`-Role: ${role}, Alive: ${client.readyState === client.OPEN}`);
        
    })

    console.log(`[WS] Total: ${clients.size} clients are connected`);
    
}
