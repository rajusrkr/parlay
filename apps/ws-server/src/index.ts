import { wsData } from "@repo/shared/dist/src";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authAckData, handShakeData } from "@repo/shared/dist/src/typesAndSchemas/ws";

dotenv.config();

interface ExtendedWebsocket extends WebSocket {
  isAlive?: boolean;
  clientRole?: string;
}

const connectedClients = new Map<ExtendedWebsocket, string>();
const wss = new WebSocketServer({ port: 8002 });
console.log(`WS-SERVER is listening on port ${8002}`);
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
  // ==========================
  // Handle messages
  // ==========================
  ws.on("message", (msg) => {
    try {
      const parsedMessage = JSON.parse(msg.toString());
      console.log(parsedMessage);

      const { eventType, data } = parsedMessage as wsData;

      // ==============================================
      // Switch case implemntation for various events
      // ==============================================
      switch (eventType) {
        // ==================
        // Handle handshake
        // ==================
        case "handShake":
          const { authToken } = data as handShakeData
          try {
            const decode: any = jwt.verify(authToken, process.env.JWT_SECRET!);
            if (typeof decode !== "object" || !decode.role) {
              throw new Error(
                "Invalid auth token provided, unable to do handshake"
              );
            }
            ws.clientRole = decode.role;
            console.log(`Client: ${ws.clientRole}, has been authorized 🔐`);

            // ==========================
            // Send auth ack to clients
            // ==========================
            const authMessage: wsData = {
              eventType: "authAck",
              data: {
                message: `Hey ${ws.clientRole} auth success, bi-directional data transform can be perform now`,
              } as authAckData,
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
        // ======================
        // Receive new buy order
        // ======================
        case "newBuyBet":
          for (const [client, clientRole] of connectedClients.entries()) {
            if (
              clientRole === "PriceEngine" &&
              client.readyState === WebSocket.OPEN
            ) {
              // Direct send the parsed message, price engine needs to know about the bet type
              client.send(JSON.stringify(parsedMessage));
            }
          }
          break;
        // ======================
        // Receive new sell order
        // ======================
        case "newSellBet":
          for (const [client, clientRole] of connectedClients.entries()) {
            if (
              clientRole === "PriceEngine" &&
              client.readyState === WebSocket.OPEN
            ) {
              // Direct send the parsed message, price engine needs to know about the bet type
              client.send(JSON.stringify(parsedMessage));
            }
          }
          break;
        // ========================================
        // Receive lmsr buy calc from Price engine
        // ========================================
        case "lmsrBuyCalculation":
          console.log("sending buy cal ti api");

          for (const [client, clientRole] of connectedClients.entries()) {
            if (
              clientRole === "ApiServer" &&
              client.readyState === WebSocket.OPEN
            ) {
              // Send the parsed message directly
              client.send(JSON.stringify(parsedMessage));
              console.log("sent buy cal ti api");

            }
          }
          break;

        // ========================================
        // Receive lmsr sell calc from Price engine
        // ========================================
        case "lmsrSellCalculation":
          for (const [client, clientRole] of connectedClients.entries()) {
            if (
              clientRole === "ApiServer" &&
              client.readyState === WebSocket.OPEN
            ) {
              // Send the parsed message directly
              client.send(JSON.stringify(parsedMessage));
            }
          }
          break;
        // default
        default:
          console.log("Unknown update received", ws.clientRole);
          break;
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
