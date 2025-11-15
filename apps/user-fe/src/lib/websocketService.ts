import { useCallback, useEffect, useRef, useState } from "react";

type MessageHandler = (message: any) => void;

const useWebsocket = (
  url: string,
  onMessage: MessageHandler,
  socketIdentity?: string,
  reconnectEnabled = true
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectEnabledRef = useRef(reconnectEnabled);
  const isConnectingRef = useRef(false); // 🆕 Prevent multiple connection attempts

  const [isConnected, setIsConnected] = useState(false);

  // Update the reconnectEnabledRef as per reconnectEnabled
  useEffect(() => {
    reconnectEnabledRef.current = reconnectEnabled;
  }, [reconnectEnabled]);

  // Cleanup
  const cleanup = () => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
  };

  // Connect
  const connect = useCallback(() => {
    // 🆕 Prevent multiple simultaneous connection attempts
    if (
      isConnectingRef.current ||
      wsRef.current?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    isConnectingRef.current = false;
    cleanup();

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
      setIsConnected(true);
      reconnectAttempts.current = 0;
      isConnectingRef.current = false; // 🆕 Reset connecting flag

      if (socketIdentity) {
        ws.send(
          JSON.stringify({
            eventType: "handShake",
            data: { authToken: socketIdentity },
          })
        );
      }
    };

    ws.onmessage = (msg) => {
      try {
        const parsedMessage = JSON.parse(msg.data);
        onMessage(parsedMessage);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsConnected(false);
      isConnectingRef.current = false; // 🆕 Reset connecting flag
      wsRef.current = null;

      if (reconnectEnabledRef.current) {
        reconnect();
      }
    };

    ws.onclose = (event) => {
      console.log("WS closed", event.code, event.reason);
      setIsConnected(false);
      isConnectingRef.current = false; // 🆕 Reset connecting flag
      wsRef.current = null;

      // 🆕 Don't reconnect for manual disconnects or auth failures
      if (event.code === 1000 || event.code === 1008) {
        console.log("Manual disconnect or auth failure, not reconnecting");
        return;
      }

      if (reconnectEnabledRef.current) {
        reconnect();
      }
    };
  }, [url, onMessage, socketIdentity]);

  const reconnect = useCallback(() => {
    if (!reconnectEnabledRef.current || isConnectingRef.current) {
      return;
    }

    const maxAttempts = 5;

    if (reconnectAttempts.current >= maxAttempts) {
      console.log("Max retry connection attempts reached");
      return;
    }

    // 🆕 Increased minimum delay and better exponential backoff
    const baseDelay = 2000; // Start with 2 seconds
    const delay = Math.min(
      30000,
      baseDelay * Math.pow(2, reconnectAttempts.current)
    );

    console.log(
      `Reconnecting in ${delay}ms... (Attempt ${reconnectAttempts.current + 1}/${maxAttempts})`
    );

    reconnectTimeout.current = setTimeout(() => {
      reconnectAttempts.current += 1;
      connect();
    }, delay);
  }, [connect]);

  const disconnect = useCallback(() => {
    console.log("Manual disconnect initiated");
    reconnectEnabledRef.current = false;
    cleanup();
    isConnectingRef.current = false; // 🆕 Reset connecting flag

    if (wsRef.current) {
      // Use normal close code to prevent reconnection
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }

    console.warn("WebSocket not connected");
    return false;
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { isConnected, disconnect, sendMessage };
};

export { useWebsocket };
