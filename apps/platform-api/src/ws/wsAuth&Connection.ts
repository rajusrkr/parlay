import jwt from "jsonwebtoken"
import { WsPayload } from "shared/dist/index"
import { ws } from "../ws-client"
import { handleWsMessage } from "./handle-messages"

export function authAndConnectToWsServer(){
    // auth token with role
    const token = jwt.sign({role: "platformApi"},`${process.env.JWT_SECRET}`)

    ws.on("open", () => {
        const message: WsPayload = {eventType: "handShake", data: {authToken: token}} 
        ws.send(JSON.stringify( message ))
        console.log(`[PLATFORM_API]: connecting to ws-server`);
    })

    handleWsMessage()
}