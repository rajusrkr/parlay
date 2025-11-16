import { Sub } from "./lib/redis/sub";
import dotenv from "dotenv";
import { ws, connectedClients } from "./lib/webSocket";

dotenv.config();

ws();
const rdSub = new Sub();
rdSub.subToPortfolioUpdate();
rdSub.subToPriceUpdate();
rdSub.listenForMessage(connectedClients);
