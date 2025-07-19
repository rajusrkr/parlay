import { useRef, useState } from "react";

const useWebsocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  // get socket identity token
  const socketIdentity = document.cookie.split("=")[1];

  const wsSetup = () => {
    const ws = new WebSocket("ws://localhost:8001");

    ws.onopen = () => {
      if (isConnected || wsRef.current) {
        console.log("Connection already exists");
        return;
      }
      const message = {
        eventType: "handShake",
        data: { authToken: socketIdentity },
      };
      ws.send(JSON.stringify(message));
      setIsConnected(true);
    };

    ws.onmessage = (msg) => {
      const message = JSON.parse(msg.data);
      console.log(message);
    };

    ws.onclose = (ev) => {
      setIsConnected(false);
      wsRef.current = null;
      console.log("Connection has been closed, err:", ev.code, ev.reason);
    };

    ws.onerror = (err) => {
      setIsConnected(false);
      wsRef.current = null;
      console.log("Error occured, err:", err);
    };

    return ws
  };

  return { wsRef, isConnected, wsSetup };
};

export { useWebsocket };
