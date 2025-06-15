import {WebSocketServer} from "ws"

const wss = new WebSocketServer({port: 8001});

wss.on("connection", (ws) => {
    console.log("new connection!!");
    // handle error
    ws.on("error", (error) => {
        console.error("Websocket error", error)
    })
    
    ws.on("message", (data) => {
        try {
            const messag = data.toString()
            const parsedMessage = JSON.parse(messag)
            console.log(parsedMessage.message);
            console.log(parsedMessage.messageType);

            if (parsedMessage.messageType === "greet") {
                console.log("message type is greet");
                
                wss.clients.forEach(client => {
                    if (client.readyState === ws.OPEN) {
                        client.send(parsedMessage.message)
                    }
                })
            }
        } catch (error) {
            console.error("Error in processing message")
        }
    })

    ws.send("connection successful")
})