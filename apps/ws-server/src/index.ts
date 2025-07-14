import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import dotnenv from "dotenv";
import { wsPacket, WsPayload, wsPort } from "shared/dist/index";

dotnenv.config();

interface ExtendedWebsocket extends WebSocket {
  isAlive?: boolean;
  clientRole?: string;
}

const clients = new Map<ExtendedWebsocket, string>();

const wss = new WebSocketServer({ port: wsPort });

const JWT_SECRET = process.env.JWT_SECRET;
console.log(`[WS] server running on port ${wsPort}`);

wss.on("connection", (ws: ExtendedWebsocket) => {
  ws.on("error", (error) => {
    console.error(`[WS] Error:`, error);
  });

  ws.on("close", () => {
    console.log(`[WS] client disconnected: ${ws.clientRole}`);
    clients.delete(ws);
    logConnectedClients();
  });

  // Handling incoming messges
  ws.on("message", (data) => {

    try {
      const message = JSON.parse(data.toString());

      console.log(message);
      

        if (message.eventType === "CONFIRM_PRICE_UPDATE") {
          console.log("CONFIRM_PRICE_UPDATE", message);

        for (const [client, role] of clients) {
          if (role === "USER_FE" && client.readyState === WebSocket.OPEN) {
            const wsData: WsPayload = {eventType: "priceUpdate", data: {
              marketId: message.marketId,
              time: message.time,
              price: {
                yes: message.yesPrice,
                no: message.noPrice
              }
            }}
            client.send(
              JSON.stringify(wsData)
            );
          }
        }

        return;
      }

      if (message.eventType === "clientHandShake") {
        console.log("hey client");

        ws.send(JSON.stringify({ message: "hey" }));

        clients.set(ws, message.data.authToken);

        logConnectedClients();

        return;
      }

      // For client authentication
      if (message.eventType === "handShake") {
        try {
          const decode: any = jwt.verify(
            message.data.authToken,
            JWT_SECRET!
          );

          if (typeof decode !== "object" || !decode.clientRole) {
            throw new Error("Invalid token payload");
          }

          ws.clientRole = decode.clientRole;

          console.log(`[WS] Authenticated as: ${ws.clientRole}`);

          const wsMessageData: wsPacket = {
            eventName: "auth-success",
            data: { role: ws.clientRole },
          };
          ws.send(JSON.stringify({ wsMessageData }));
          clients.set(ws, ws.clientRole!);
          logConnectedClients();
          return;
        } catch (error) {
          console.log(error);
          ws.send(
            JSON.stringify({ type: "auth_failed", error: "Invalid token" })
          );
          ws.close();
          return;
        }
      }

      // Receive the order events send them to price engine accordingly
      if (message.eventType === "newOrder") {
        console.log(`[ws-server] order-placed received from ${ws.clientRole}`);

        // For buy order in yes side
        const wsMessageData: WsPayload = {
          eventType: "newOrder",
          requestId: message.requestId,
          data: message.data,
        };

        for (const [client, role] of clients.entries()) {
          if (role === "price-engine" && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ wsMessageData }));
          }
        }
      }

      // Receive price-update
      if (message.eventType === "price-update") {
        const priceUpdates = message.data.priceUpdate;

        for (const [client, role] of clients.entries()) {
          const wsMessageData: wsPacket = {
            eventName: "price-update",
            data: priceUpdates,
          };

          if (role === "platform-api" && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ wsMessageData }));
          }
        }
      }

      if (!ws.clientRole) {
        ws.send(JSON.stringify({ type: "unauthorized" }));
        ws.close();
        logConnectedClients();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  });
});

function logConnectedClients() {
  console.log("[WS] Connected clients");
  clients.forEach((role, client) => {
    console.log(`-Role: ${role}, Alive: ${client.readyState === client.OPEN}`);
  });

  console.log(`[WS] Total: ${clients.size} clients are connected`);
}
