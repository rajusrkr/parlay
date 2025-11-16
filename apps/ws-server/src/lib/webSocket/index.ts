import { Request } from "express";
import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

interface ExtendedWebsocket extends WebSocket {
  isAlive: boolean;
}
const wss = new WebSocketServer({ port: 8002 });

const connectedClients = new Map<ExtendedWebsocket, string>();

function ws() {
  wss.on("connection", (ws: ExtendedWebsocket, req: Request) => {
    ws.isAlive = true;
    ws.on("pong", () => {
      console.log("PONG RECEIVED");

      ws.isAlive = true;
    });

    ws.on("message", (msg) => {
      const msgData = JSON.parse(msg.toString());

      if ((msgData.type = "authHandShake")) {
        const user = handleAuthHandShake(req.headers.cookie!);

        connectedClients.set(ws, user);
      }
    });
  });

  wss.on("close", () => {
    clearInterval(heartBeatInterval);
  });

  function handleAuthHandShake(cookies: string): string {
    try {
      const cookieObj = Object.fromEntries(
        cookies
          .split(";")
          .map((c) => c.trim())
          .map((c) => c.split("="))
      );

      const decode = jwt.verify(
        cookieObj.socketIndentity,
        `${process.env.JWT_SECRET}`
      );
      // @ts-ignore
      const user = decode.userId as string;

      return user;
    } catch (error) {
      throw new Error(
        `JWT error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  const heartBeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = ws as ExtendedWebsocket;

      if (!client.isAlive) {
        console.log(`TERMINATING INACTIVE CLIENT, ${client}`);
        ws.terminate();
        connectedClients.delete(ws as ExtendedWebsocket);
      }

      client.isAlive = false;
      ws.ping();
    });
  }, 60 * 1000);
}

export { connectedClients, ws };
