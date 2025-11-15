import { Request } from "express";
import { Sub } from "./lib/redis/sub/index";
import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface ExtendedWebsocket extends WebSocket {
  isAlive: boolean;
}

const connectedClients = new Map<ExtendedWebsocket, string>();
const wss = new WebSocketServer({ port: 8002 });

// Heartbeat, ping/pong
const heartBeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const client = ws as ExtendedWebsocket;

    if (!client.isAlive) {
      console.log(`TERMINATING INACTIVE CLIENT ${client}`);
      client.terminate();
      connectedClients.delete(ws as ExtendedWebsocket);
    }

    client.isAlive = false; // Settinf alive to false, will make it true on pong
    ws.ping();
  });
}, 15000);

// Auth
function handleCookieAuth(cookie: string) {
  try {
    const cookieObj = Object.fromEntries(
      cookie
        .split(";")
        .map((c) => c.trim())
        .map((c) => c.split("="))
    );

    const socketIndentity = cookieObj.socketIndentity;
    const decode = jwt.verify(socketIndentity, `${process.env.JWT_SECRET}`);
    //@ts-ignore
    const userId = decode.userId;

    return userId;
  } catch (error) {
    throw new Error(
      `Auth error, ${error instanceof Error ? error.message : "Unknow error"}`
    );
  }
}

wss.on("connection", async (ws: ExtendedWebsocket, req: Request) => {
  ws.isAlive = true;
  ws.on("pong", () => {
    console.log("Pong received from client");
    ws.isAlive = true; // Making alive true on pong
  });

  // @ts-ignore
  const cookie = req.headers.cookie;

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === "authHandShake") {
        console.log("Auth handshake message received");

        const user = handleCookieAuth(cookie!);
        console.log(user);

        connectedClients.set(ws, `user:${user}`);
      }
    } catch (error) {
      console.log(error);
    }
  });

  ws.on("error", (err) => {
    console.error("Error happend", err);
    connectedClients.delete(ws);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    connectedClients.delete(ws);
  });

  const subs = new Sub(ws);
  await subs.subToPortfolioUpdate();
  await subs.subToPriceUpdate();
  await subs.listenForMessage();
});

wss.on("close", () => {
  clearInterval(heartBeatInterval);
});
