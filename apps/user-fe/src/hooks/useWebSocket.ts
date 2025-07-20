import { useCallback, useEffect, useRef, useState } from "react";

const useWebsocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // get socket-identity token
  const socketIdentity = document.cookie.split("=")[1];

  const handleMessage = useCallback((msg: MessageEvent) => {
    try {
      const message = JSON.parse(msg.data);
      console.log(message);
    } catch (error) {
      console.log("Error in parsing message", error);
    }
  }, []);

  const wsSetup = useCallback(() => {
    // if any connection exists paus
    if (wsRef.current) {
      console.log("Connection already exists");
      return null;
    }

    const ws = new WebSocket("ws://localhost:8001");

    ws.onopen = () => {
      const message = {
        eventType: "handShake",
        data: { authToken: socketIdentity },
      };
      ws.send(JSON.stringify(message));
      setIsConnected(true);
      wsRef.current = ws;
    };

    ws.onmessage = handleMessage;

    ws.onclose = (ev) => {
      setIsConnected(false);
      wsRef.current = null;
      console.log("Connection closed", ev.code, ev.reason);
    };

    ws.onerror = (err) => {
      setIsConnected(false);
      wsRef.current = null;
      console.error("Websocket error", err);
    };

    return ws;
  }, [handleMessage]);

  const connect = useCallback(() => {
    wsRef.current = wsSetup();
  }, [wsSetup]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, "Component unmount");
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { isConnected, connect, disconnect };
};

export { useWebsocket };
