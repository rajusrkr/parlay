import dotenv from "dotenv"
import { authAndConnectToWsServer } from "./ws/handle-auth"


dotenv.config()

async function start(){
    await authAndConnectToWsServer()
}

start()