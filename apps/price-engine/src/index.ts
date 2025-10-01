import dotenv from "dotenv"
import { authAndConnectToWsServer } from "./ws/wsAuthAndConnect"

dotenv.config();

(async () => {
    authAndConnectToWsServer()
})();