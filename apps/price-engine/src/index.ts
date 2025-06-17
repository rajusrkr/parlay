import dotenv from "dotenv"
import { connectToWsServer } from "./ws-client"

dotenv.config()

async function start(){
    await connectToWsServer()
}

start()