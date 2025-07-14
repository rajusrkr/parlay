import jwt from "jsonwebtoken"
import { WsPayload } from "shared/dist/index"
import { ws } from "../ws-client"
import { handleWsMessage } from "./handle-messages"

export function authAndConnectToWsServer(){
    // auth token with role
    const token = jwt.sign({clientRole: "PLATFORM_API"},`${process.env.JWT_SECRET}`)
        
    const wsData: WsPayload = {eventType: "handShake", data: {authToken: token}}

    ws.on("open", () => {
        ws.send(JSON.stringify( wsData ))
        console.log(`[PLATFORM_API]: connecting to ws-server`);
    })

    handleWsMessage()
}