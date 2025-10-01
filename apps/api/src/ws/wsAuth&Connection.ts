import jwt from "jsonwebtoken"
import { handleWsEvents } from "./handleWsEvents"
import { ws } from "./wsConnection"

export function authAndConnectToWsServer(){
    // auth token with role
    console.log(`API jwt secret from shared: ${process.env.JWT_SECRET}`);
    
    const token = jwt.sign({role: "ApiServer"},`${process.env.JWT_SECRET}`)

    ws.on("open", () => {
        const message = {eventType: "handShake", data: {authToken: token}} 
        ws.send(JSON.stringify( message ))
        console.log(`[PLATFORM_API]: connecting to ws-server`);
    })

    handleWsEvents()
}