import { ws } from "../ws-client";

export function handleWsMessage(): Promise<any>{
    
    return new Promise((resolve, reject) => {
        ws.on("message", (msg) => {
            const receivedData = JSON.parse(msg.toString())
            console.log(receivedData);
            resolve(receivedData)
        })

    })
}