import { createContext, useContext, useEffect, useRef, useState } from "react";

interface SocketContextType {
    socket: WebSocket | null;
    sendMessage: (msg: any) => void
}

const SocketContext = createContext<SocketContextType | null>(null);


function getCookie(name: string){
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));

    return match ? match[2] : null;
}

const authMessage = {
    eventType: "handShake",
    data: {
        authToken: getCookie("socket-identity")
    }
}


export const SocketProvider = ({children}:{children: React.ReactNode}) => {
    const socketRef = useRef<WebSocket | null>(null)
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const retryRef = useRef(0)


    // Connect function
    const connect = () => {
        const ws = new WebSocket("ws://localhost:8001")

        ws.onopen = () => {

            if (socketRef.current !== null) return;

            ws.send(JSON.stringify(authMessage))
            console.log('Ws connected');
            retryRef.current = 0
        }

        ws.onmessage = (msg) => {
            console.log("Message recived from ws server");
            const message = JSON.parse(msg.data);
            if (message.eventType === "authAck") {
                socketRef.current = ws;
                setSocket(ws)
            }
            
        }

        ws.onclose = () => {
            console.log("Ws connection closed");
            
            // exponential backoff
            const timeout = Math.min(1000 * 2 ** retryRef.current, 10000)
            retryRef.current += 1;

            setTimeout(connect, timeout)
        }


        ws.onerror = (err) => {
            console.error(err)
            ws.close()
        }
    }


    useEffect(() => {
        connect()

        return  () => socketRef.current?.close()
    }, [])



    const sendMessage = (msg: any) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(msg))
        } else {
            console.log("Web socket not open");
            
        }
    }


    return (
        <SocketContext.Provider value={{socket, sendMessage}}>
            {children}
        </SocketContext.Provider>
    )

}


export const useSocket = () => {
    const context = useContext(SocketContext)
    
    if (!context) throw new Error("Something went wrong, socket provider");
    console.log(context);
    
    return context
}