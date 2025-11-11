import { WebSocket, WebSocketServer } from "ws";

interface ExtendedWebsocket extends WebSocket {
    isAlive: boolean,
}

class Stream {
    private readonly connectedClients = new Map<ExtendedWebsocket, string>(); // new Map<wsInstance, userId>()
    private readonly wss = new WebSocketServer({ port: 8002 });


    private heartBeatInternal = setInterval(() => {
        this.wss.clients.forEach((ws) => {
            const client = ws as ExtendedWebsocket;

            if (!client.isAlive) {
                console.log(`TERMINATING INACTIVE CLIENT ${client}`);
                this.connectedClients.delete(ws as ExtendedWebsocket)
                client.terminate()
            }

            client.isAlive = false;
            ws.ping()
        })
    }, 15000)

    
  

    


}