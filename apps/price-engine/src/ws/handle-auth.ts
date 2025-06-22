import jwt from "jsonwebtoken"
import { wsSend } from "shared/dist/index"
import { ws } from "../ws-client"
export function authAndConnectToWsServer(){
    return new Promise<void>((resolve, reject) => {
        // auth token with role
        const token = jwt.sign({clientRole: "price-engine"},`${process.env.JWT_SECRET}`)
        
        const wsData: wsSend = {sentEvent: "handShake", data: {token}}

        ws.on("open", () => {
            ws.send(JSON.stringify({ wsData }))
            console.log(`[Platform Api] connecting to ws-server`);
            resolve()
        })

        ws.on("error", reject)
    })
}