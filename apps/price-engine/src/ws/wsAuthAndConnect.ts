import jwt from "jsonwebtoken"
import { WsPayload } from "@repo/shared/dist/src"
import { ws } from "./wsConnection"
import { handleWsEvents } from "./handleWsEvents"

export function authAndConnectToWsServer(){
        // auth token with role
        const token = jwt.sign({role: "PriceEngine"},`${process.env.JWT_SECRET}`)
        
        ws.on("open", () => {
        const message: WsPayload = {eventType: "handShake", data: {authToken: token}}
             ws.send(JSON.stringify( message ))
            console.log(`[Platform Api] connecting to ws-server`);
        })

        handleWsEvents()
}