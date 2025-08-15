import jwt from "jsonwebtoken"
import { ws } from "../ws-client"
import { handleWsEvents } from "./handle-ws-events"

export function authAndConnectToWsServer(){
    // auth token with role
    const token = jwt.sign({role: "platformApi"},`${process.env.JWT_SECRET}`)

    ws.on("open", () => {
        const message = {eventType: "handShake", data: {authToken: token}} 
        ws.send(JSON.stringify( message ))
        console.log(`[PLATFORM_API]: connecting to ws-server`);
    })

    handleWsEvents()
}