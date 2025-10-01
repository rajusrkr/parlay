import { WsPayload } from "@repo/shared/dist/src";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface ExtendedWebsocket extends WebSocket {
  isAlive?: boolean;
  clientRole?: string;
}

const connectedClients = new Map<ExtendedWebsocket, string>();
const wss = new WebSocketServer({ port: 8001 });
console.log(`WS-SERVER is listening on port ${8001}`);
// ===================
// Handle heart beat
// ===================
const heartbeat_interval = 15000;
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const client = ws as ExtendedWebsocket;

    if (!client.isAlive) {
      console.log("Terminating inactive client:", client.clientRole);
      connectedClients.delete(client);
      return client.terminate();
    }

    client.isAlive = false;
    ws.ping();
  });
}, heartbeat_interval);

wss.on("connection", (ws: ExtendedWebsocket) => {
  // ======================
  // Handle pong
  // ======================
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
    console.log("pong received from:", ws.clientRole, "🟢");
    console.log("Total clients:", connectedClients.size);
  });

  // ==================
  // Handle error
  // ==================
  ws.on("error", (err) => {
    console.error("Error ocuured", err);
    // will decide later if need to remove the client or not
  });

  // ==========================
  // Handle connection closing
  // ==========================
  ws.on("close", () => {
    console.log("Client disconnected", ws.clientRole, "🔴");
    connectedClients.delete(ws);
  });

  // handle messages
  ws.on("message", (msg) => {
    try {
      const parsedMessage = JSON.parse(msg.toString());
      console.log(parsedMessage);

      const { eventType, data, marketId } = parsedMessage;

      // ==============================================
      // Switch case implemntation for various events
      // ==============================================
      switch (eventType) {
        // ==================
        // Handle handshake
        // ==================
        case "handShake":
          try {
            console.log(`JWT secret from root env ${process.env.JWT_SECRET}`);
            console.log(`Auth token from ${data.authToken}`);
            
            const decode: any = jwt.verify(data.authToken, process.env.JWT_SECRET!);
            if (typeof decode !== "object" || !decode.role) {
              throw new Error(
                "Invalid auth token provided, unable to do handshake"
              );
            }
            // Set role
            ws.clientRole = decode.role;
            console.log(`Client: ${ws.clientRole}, has been authorized 🔐`);

            // ==========================
            // Send auth ack to clients
            // ==========================
            const authMessage: WsPayload = {
              eventType: "authAck",
              data: {
                message: `Hey ${ws.clientRole} Auth success, bi-directional data transform can be perform now`,
              },
            };
            ws.send(JSON.stringify(authMessage));
            connectedClients.set(ws, ws.clientRole!);
            console.log(getConnectedClients().join("\n"));
          } catch (error) {
            throw new Error(
              `Error occured on place of performing hand shake ${error}`
            );
          }
          break;

        // ==================
        // Receive new order
        // ==================
        case "newOrder":
          for (const [client, clientRole] of connectedClients.entries()) {
            if (
              clientRole === "priceEngine" &&
              client.readyState === WebSocket.OPEN
            ) {
              client.send(JSON.stringify(parsedMessage));
            }
          }
          break;

        // ========================================
        // Receive price update from Price engine
        // ========================================
        case "priceUpdate":
          console.log("Price update received from Price Engine");
          for (const [client, clientRole] of connectedClients.entries()) {
            if (
              clientRole === "ApiServer" &&
              client.readyState === WebSocket.OPEN
            ) {
              client.send(JSON.stringify(parsedMessage));
            }
          }
          break;

        // ====================================== 
        // Price update to ui afte db operation
        // ======================================
        case "priceBroadCast":
          console.log("Final price uodate received from Platform Api");

          console.log("marketId", marketId);


          const finalPriceMessage = {
            eventType: "finalPriceUpdate",

            data: {
              marketId: marketId,
              outcomes: data.outcomes

            },
          };

          for (const [client, clientRole] of connectedClients) {
            if (
              clientRole === "userFe" &&
              client.readyState === WebSocket.OPEN
            ) {
              client.send(JSON.stringify(finalPriceMessage));
            }
          }
          break;

        // default
        default:
          console.log("Unknown update received", ws.clientRole);
      }
    } catch (error) {
      throw new Error(
        `Error occured on or near the place of ws on message event ${error}`
      );
    }
  });
});

// ================= 
// clear interval
// =================
wss.on("close", () => {
  clearInterval(heartbeatInterval);
});

// ==============================
// For loging connected clients
// ==============================
function getConnectedClients() {
  const info: string[] = [];
  connectedClients.forEach((clientRole, client) => {
    const connectedClient = `Connected client: ${clientRole}, Is Active: ${client.readyState === client.OPEN}`;
    const totalConnection = `Total connections: ${connectedClients.size}`;

    info.push(connectedClient, totalConnection);
  });
  return info;
}
