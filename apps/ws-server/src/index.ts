import { wsPort } from "shared/src/index";
import { WsPayload } from "types/src/index";
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface ExtendedWebsocket extends WebSocket {
  isAlive?: boolean;
  clientRole?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

const connectedClients = new Map<ExtendedWebsocket, string>();

const wss = new WebSocketServer({ port: wsPort });
console.log(`WS-SERVER is listening on port ${wsPort}`);

// Heartbeat interval

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
  // setting is alive true
  ws.isAlive = true;

  // handle pong
  ws.on("pong", () => {
    ws.isAlive = true;
    console.log("pong received from:", ws.clientRole, "🟢");
    console.log("Total clients:", connectedClients.size);
  });

  // error handle
  ws.on("error", (err) => {
    console.error("Error ocuured", err);
    // will decide later if need to remove the client or not
  });

  // connection close handle
  ws.on("close", () => {
    console.log("Client disconnected", ws.clientRole, "🔴");
    // remove the client on close
    connectedClients.delete(ws);
  });

  // handle messages
  ws.on("message", (msg) => {
    try {
      const parsedMessage = JSON.parse(msg.toString());
      console.log(parsedMessage);

      const { eventType, data, requestId, marketId } = parsedMessage;
      const {
        costToUser,
        returnToUser,
        yesPriceAftereOrder,
        noPriceAfterOrder,
        yesPrice,
        noPrice,
        userTotalQty,
        avgPrice,
        time,
      } = data;

      // Switch case implemntation
      switch (eventType) {
        // handle handShakes
        case "handShake":
          try {
            const decode: any = jwt.verify(data.authToken, JWT_SECRET!);

            if (typeof decode !== "object" || !decode.role) {
              throw new Error(
                "Invalid auth token provided, unable to do handshake"
              );
            }
            // setting role
            ws.clientRole = decode.role;

            console.log(`Client: ${ws.clientRole}, has been authorized 🔐`);

            // Message
            const authMessage: WsPayload = {
              eventType: "authAck",
              data: {
                message: `Hey ${ws.clientRole} Auth success, bi-directional data transform can be perform now`,
              },
            };
            // send back response
            ws.send(JSON.stringify(authMessage));
            connectedClients.set(ws, ws.clientRole!);

            console.log(getConnectedClients().join("\n"));
          } catch (error) {
            throw new Error(
              `Error occured on place of performing hand shake ${error}`
            );
          }
          break;

        // handle new order
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

        // Handle price update from price engine
        case "priceUpdate":
          console.log("Price update received from Price Engine");
          for (const [client, clientRole] of connectedClients.entries()) {
            if (
              clientRole === "platformApi" &&
              client.readyState === WebSocket.OPEN
            ) {
              client.send(JSON.stringify(parsedMessage));
            }
          }
          break;

        // Handle final price update, price update to ui afte db operation
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

// clear interval
wss.on("close", () => {
  clearInterval(heartbeatInterval);
});

// Get connected clients
function getConnectedClients() {
  const info: string[] = [];
  connectedClients.forEach((clientRole, client) => {
    const connectedClient = `Connected client: ${clientRole}, Is Active: ${client.readyState === client.OPEN}`;
    const totalConnection = `Total connections: ${connectedClients.size}`;

    info.push(connectedClient, totalConnection);
  });

  return info;
}
