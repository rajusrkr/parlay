import { useMarketStore } from "@/stores/useMarketStore";
import { useCallback, useEffect, useRef, useState } from "react";

const useWebsocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const { handlePriceChange } = useMarketStore();

  // get socket-identity token (TODO: implement better cookie fetcj h later)
  function getCookie(name: string) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    console.log(match);
    return match ? match[2] : null
  }

  const socketIdentity = getCookie("socket-identity")
  

  const handleMessage = useCallback((msg: MessageEvent) => {
    try {
      const parsedMessage = JSON.parse(msg.data);

      const { eventType, marketId, data } = parsedMessage;
      const { time, noPrice, yesPrice } = data;

      switch (eventType) {
        case "authAck":
          console.log("Auth Ack received from ws server");
          break;

        case "finalPriceUpdate":
          console.log("Final price update received from ws server");
          console.log("Market id:", marketId);
          console.log("Data:", data);

          // Handle price change
          handlePriceChange({ marketId, time, noPrice, yesPrice });
          break;

        default:
          console.log("Unknown event received from ws server");
      }
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

  return { isConnected, connect, disconnect, handleMessage };
};

export { useWebsocket };
