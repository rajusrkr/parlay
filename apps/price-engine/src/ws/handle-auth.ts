import jwt from "jsonwebtoken"
import { WsPayload } from "shared/dist/index"
import { ws } from "../ws-client"
export function authAndConnectToWsServer(){
        // auth token with role
        const token = jwt.sign({clientRole: "PRICE_ENGINE"},`${process.env.JWT_SECRET}`)
        
        const wsData: WsPayload = {eventType: "handShake", data: {authToken: token}}

        ws.on("open", () => {
            ws.send(JSON.stringify( wsData ))
            console.log(`[Platform Api] connecting to ws-server`);
        })

}