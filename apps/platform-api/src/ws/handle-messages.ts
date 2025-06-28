import { ws } from "../ws-client";

export function handleWsMessage() {
     ws.on("message", (msg) => {
            const receivedData = JSON.parse(msg.toString())
            // console.log(receivedData.wsMessageData);
            // resolve(receivedDatsa)
        })
}