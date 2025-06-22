import { wsSend } from "shared/dist/index"
import { pendingRequests, ws } from "../ws-client"
import {v4 as uuidv4} from "uuid"
import { handleWsMessage } from "./handle-messages"

export function sendOrderToWsServer(wsData: wsSend): Promise<any>{
    return new Promise<void>( async (resolve, reject) => {

        const uniqueIdentificationId = uuidv4() 

        pendingRequests.set(uniqueIdentificationId, {resolve, reject})

        ws.send(JSON.stringify({wsData}))
        const message = await handleWsMessage()

        console.log("message", message);

        resolve(message)
        
    })
}