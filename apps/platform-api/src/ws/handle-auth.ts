import jwt from "jsonwebtoken"
import { wsPacket } from "shared/dist/index"
import { ws } from "../ws-client"
import { handleWsMessage } from "./handle-messages"
export function authAndConnectToWsServer(){
    return new Promise<void>((resolve, reject) => {
        // auth token with role
        const token = jwt.sign({clientRole: "platform-api"},`${process.env.JWT_SECRET}`)
        
        const wsData: wsPacket = {eventName: "handShake", data: {token}}

        ws.on("open", () => {
            ws.send(JSON.stringify({ wsData }))
            console.log(`[Platform Api] connecting to ws-server`);
            resolve()
        })

        handleWsMessage()

        ws.on("error", reject)
    })
}