import dotenv from "dotenv"
import { authAndConnectToWsServer } from "./ws/wsAuth&Connection"


dotenv.config()

async function start(){
    authAndConnectToWsServer()
}

start()