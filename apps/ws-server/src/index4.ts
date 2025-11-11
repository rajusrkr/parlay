// This will be the main file, index.ts

import { Sub } from "./lib/redis/sub/index"

import { WebSocket, WebSocketServer } from "ws";


export interface ExtendedWebsocket extends WebSocket {
    isAlive: boolean
}


const connectedClients = new Map<ExtendedWebsocket, string>()
const wss = new WebSocketServer({ port: 8002 });


// const heartBeatInterval = setInterval(() => {
//     wss.clients.forEach((ws) => {
//         const client = ws as ExtendedWebsocket;

//         if (!client.isAlive) {
//             console.log(`TERMINATING INACTIVE CLIENT ${client}`);
//             client.terminate()
//             connectedClients.delete(ws as ExtendedWebsocket)
//         }

//         client.isAlive = false;
//         ws.ping();
//     })
// }, 15000);

wss.on("connection", async (ws: ExtendedWebsocket) => {
    console.log("going for connection check");

    ws.isAlive = true;
    ws.on("pong", () => {
        console.log("Pong received from client");
    })

    ws.on("error", (err) => {
        console.log("Error happend", err);
        connectedClients.delete(ws)
    })

    ws.on("close", () => {
        console.log("Client disconnected");
        connectedClients.delete(ws)
    })

    const subs = new Sub(ws)
    // console.log("REDIS");

    await subs.subToPortfolioUpdate()
    await subs.subToPriceUpdate()
    await subs.listenForMessage()

    

    // console.log(data);



})

// wss.on("close", () => {
//     clearInterval(heartBeatInterval)
// })
