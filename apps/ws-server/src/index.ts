import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken"
import dotnenv from "dotenv"
import {wsMessage} from "shared/dist/index"

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
    return new Promise((resolve, reject) => {

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
                // for client authentication
                if (message.wsData.sentEvent === "handShake") {
                    try {
                        const decode: any = jwt.verify(message.wsData.data.token, JWT_SECRET!)
                        
                    if (typeof decode !== "object" || !decode.clientRole) {
                        throw new Error("Invalid token payload")
                    }
                    
                    ws.clientRole = decode.clientRole
                    
                    console.log(`[WS] Authenticated as: ${ws.clientRole}`);
                    
                    const wsMessageData: wsMessage = {messageEvent: "auth-success", data: {role: ws.clientRole}}
                    ws.send(JSON.stringify({wsMessageData}))
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
            
            // receive the order events send them to price engine accordingly
            if (message.wsData.sentEvent === "new-order") {
                console.log(`[ws-server] order-placed received from ${ws.clientRole}`);

                    const payload = message.wsData.data;
                
                // for buy order in yes side
                const wsMessageData: wsMessage = {messageEvent: "new-order", data: payload}
                
                for(const [client, role] of clients.entries()){
                    if (role === "price-engine" && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ wsMessageData }))
                    }
                }
            }
            
            // receive price-update
            if (message.wsData.sentEvent === "price-update") {

                const priceUpdates = message.wsData.data.priceUpdate

                for(const [client, role] of clients.entries()){
                const wsMessageData: wsMessage = {messageEvent: "price-update", data: priceUpdates}

                    if (role === "platform-api" && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({wsMessageData}))
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
            console.log(error);
        }
    })
})
})



function logConnectedClients(){
    console.log('[WS] Connected clients');
    clients.forEach((role, client) => {
        console.log(`-Role: ${role}, Alive: ${client.readyState === client.OPEN}`);
        
    })

    console.log(`[WS] Total: ${clients.size} clients are connected`);
}
