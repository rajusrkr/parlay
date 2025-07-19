// import { WebSocketServer, WebSocket } from "ws";
// import jwt from "jsonwebtoken";
// import dotnenv from "dotenv";
// import { wsPacket, WsPayload, wsPort } from "shared/dist/index";

// dotnenv.config();

// interface ExtendedWebsocket extends WebSocket {
//   isAlive?: boolean;
//   clientRole?: string;
// }

// const clients = new Map<ExtendedWebsocket, string>();

// const wss = new WebSocketServer({ port: wsPort });

// const JWT_SECRET = process.env.JWT_SECRET;
// console.log(`[WS] server running on port ${wsPort}`);

// wss.on("connection", (ws: ExtendedWebsocket) => {
//   ws.on("error", (error) => {
//     console.error(`[WS] Error:`, error);
//   });

//   ws.on("close", () => {
//     console.log(`[WS] client disconnected: ${ws.clientRole}`);
//     clients.delete(ws);
//     logConnectedClients();
//   });

//   // Handling incoming messges
//   ws.on("message", (data) => {

//     try {
//       const message = JSON.parse(data.toString());

//       console.log(message);
      

//         if (message.eventType === "CONFIRM_PRICE_UPDATE") {
//           console.log("CONFIRM_PRICE_UPDATE", message);

//         for (const [client, role] of clients) {
//           if (role === "USER_FE" && client.readyState === WebSocket.OPEN) {
//             const wsData: WsPayload = {eventType: "priceUpdate", data: {
//               marketId: message.marketId,
//               time: message.time,
//               price: {
//                 yes: message.yesPrice,
//                 no: message.noPrice
//               }
//             }}
//             client.send(
//               JSON.stringify(wsData)
//             );
//           }
//         }

//         return;
//       }

//       if (message.eventType === "clientHandShake") {
//         console.log("user fe connecting...");
        
//         ws.send(JSON.stringify({ message: "hey" }));

//         clients.set(ws, message.data.authToken);

//         logConnectedClients();

//         return;
//       }

//       // For client authentication
//       if (message.eventType === "handShake") {
//         try {
//           const decode: any = jwt.verify(
//             message.data.authToken,
//             JWT_SECRET!
//           );

//           if (typeof decode !== "object" || !decode.clientRole) {
//             throw new Error("Invalid token payload");
//           }

//           ws.clientRole = decode.clientRole;

//           console.log(`[WS] Authenticated as: ${ws.clientRole}`);

//           const wsMessageData: wsPacket = {
//             eventName: "auth-success",
//             data: { role: ws.clientRole },
//           };
//           ws.send(JSON.stringify({ wsMessageData }));
//           clients.set(ws, ws.clientRole!);
//           logConnectedClients();
//           return;
//         } catch (error) {
//           console.log(error);
//           ws.send(
//             JSON.stringify({ type: "auth_failed", error: "Invalid token" })
//           );
//           ws.close();
//           return;
//         }
//       }

//       // Receive the order events send them to price engine accordingly
//       if (message.eventType === "newOrder") {
//         console.log(`[ws-server] order-placed received from ${ws.clientRole}`);

//         // For buy order in yes side
//         const wsMessageData: WsPayload = {
//           eventType: "newOrder",
//           requestId: message.requestId,
//           data: message.data,
//         };

//         for (const [client, role] of clients.entries()) {
//           if (role === "price-engine" && client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify({ wsMessageData }));
//           }
//         }
//       }

//       // Receive price-update
//       if (message.eventType === "price-update") {
//         const priceUpdates = message.data.priceUpdate;

//         for (const [client, role] of clients.entries()) {
//           const wsMessageData: wsPacket = {
//             eventName: "price-update",
//             data: priceUpdates,
//           };

//           if (role === "platform-api" && client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify({ wsMessageData }));
//           }
//         }
//       }

//       if (!ws.clientRole) {
//         ws.send(JSON.stringify({ type: "unauthorized" }));
//         ws.close();
//         logConnectedClients();
//         return;
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });
// });

// function logConnectedClients() {
//   console.log("[WS] Connected clients");
//   clients.forEach((role, client) => {
//     console.log(`-Role: ${role}, Alive: ${client.readyState === client.OPEN}`);
//   });

//   console.log(`[WS] Total: ${clients.size} clients are connected`);
// }

































import { wsPort, WsPayload } from "shared/dist/index";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

interface ExtendedWebsocket extends WebSocket {
    isAlive? : boolean,
    clientRole?: string
}

const JWT_SECRET = process.env.JWT_SECRET;

const connectedClients = new Map<ExtendedWebsocket, string>()

const wss = new WebSocketServer({port: wsPort})
console.log(`WS-SERVER is listening on port ${wsPort}`);


// Heartbeat interval

const heartbeat_interval = 15000;

const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
        const client = ws as ExtendedWebsocket;

        if (!client.isAlive) {
            console.log('Terminating inactive client:', client.clientRole);
            connectedClients.delete(client)
            return client.terminate();
        }

        client.isAlive = false;
        ws.ping()
    })
}, heartbeat_interval)

wss.on("connection", (ws: ExtendedWebsocket) => {
    // setting is alive true
    ws.isAlive = true;

    // handle pong
    ws.on("pong", () => {
        ws.isAlive = true;
        console.log("pong received from:", ws.clientRole,"🟢");
    })


    // error handle
    ws.on("error", (err) => {
        console.error('Error ocuured', err)
    })

    // connection close handle
    ws.on("close", () => {
        console.log('Client disconnected', ws.clientRole, "🔴");
        // remove the client
        connectedClients.delete(ws)
    })

    // handle messages
    ws.on("message", (msg) => {
        try {
            const parsedMessage = JSON.parse(msg.toString())

            // handle handShakes
            if (parsedMessage.eventType === "handShake") {

                try {
                    const decode: any = jwt.verify(parsedMessage.data.authToken, JWT_SECRET!)
                  
                    if (typeof decode !== "object" || !decode.role) {
                        throw new Error("Invalid auth token provided, unable to do handshake")
                    }
                    // setting role
                    ws.clientRole = decode.role;

                    console.log(`Client: ${ws.clientRole}, has been authorized 🔐`);

                    // Message
                    const message: WsPayload = {
                        eventType: "authAck",
                        data: {
                           message: `Hey ${ws.clientRole} Auth success, bi-directional data transform can be perform now` 
                        }
                    }
                    // WILL SEND MESSAGE LATER
                    // ws.send(JSON.stringify(message));
                    connectedClients.set(ws, ws.clientRole!)

                    console.log(getConnectedClients().join("\n"));
                    
                } catch (error) {
                    throw new Error(`Error occured on place of performing hand shake ${error}`);
                }
            }
        } catch (error) {
            throw new Error(`Error occured on or near the place of ws on message event ${error}`);
        }
    })

})

// clear interval
wss.on("close", () => {
    clearInterval(heartbeatInterval)
})

// Get connected clients
function getConnectedClients(){
    const info: string[] = []
    connectedClients.forEach((clientRole, client) => {
        const connectedClient = `Connected client: ${clientRole}, Is Active: ${client.readyState === client.OPEN}`
        const totalConnection = `Total connections: ${connectedClients.size}`

        info.push(connectedClient, totalConnection)
    })

    return info
}