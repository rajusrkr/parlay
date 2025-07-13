import { useCallback, useEffect, useRef, useState } from "react";

// Web socket option interface
interface UseWebSocketOptions {
  onOpen?: (ws: WebSocket) => void;
  onClose?: (event: CloseEvent) => void;
  onMessage?: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  shouldReconnect: (event: CloseEvent) => boolean;
  reconnectInterval?: number;
  heartBeatInterval?: number;
  heartBeatMessage?: string | (() => string); // its a string or a func that returns string, so we can send both simple string or a func => json.stringify({type: "data"})
}

export const useWebSocket = (url: string, options: UseWebSocketOptions) => {
  const {
    onOpen,
    onClose,
    onMessage,
    onError,
    shouldReconnect = () => true,
    reconnectInterval = 3000,
    heartBeatInterval = 15000,
    heartBeatMessage = "ping",
  } = options;

  //   refs
  const wsRef = useRef<WebSocket | null>(null);
  const heartBeatRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const messageQueue = useRef<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    // To ensure that the code only runs on the browser, not on the server side i.e nextjs server side safety
    if (typeof window === "undefined") return;

    // Opening a new connection
    const ws = new WebSocket(url);
    // Storing it in the wsRef
    wsRef.current = ws;

    // After successful ws connection
    ws.onopen = () => {
      setIsConnected(true);
      // send data like auth token
      if (onOpen) onOpen(ws);

      // flush queue, if any message before the connection queue them and when the connection is ready fire that
      while (messageQueue.current.length > 0) {
        ws.send(messageQueue.current.shift()!);
      }

      // hearbeat
      if (heartBeatInterval! > 0) {
        heartBeatRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            // If the heartBeatMessageType is func then pass a func else string
            const msg =
              typeof heartBeatMessage === "function"
                ? heartBeatMessage()
                : heartBeatMessage;

            ws.send(msg!);
          }
        }, heartBeatInterval);
      }
    };

    ws.onmessage = onMessage || null;
    ws.onerror = onError || null;

    // Closing
    ws.onclose = (event) => {
      // Update state
      setIsConnected(false);
      // clear interval for the heartBeatRef
      if (heartBeatRef.current) clearInterval(heartBeatRef.current);
      // if i provide any func
      if (onClose) onClose(event);
      // Should we reconnect, is it graceful close or something else
      if (shouldReconnect(event)) {
        reconnectTimeout.current = setTimeout(connect, reconnectInterval);
      }
    };
  }, [url]);

  // for sending message
  const sendMessage = useCallback((message: string) => {
    const ws = wsRef.current;

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      messageQueue.current.push(message);
    }
  }, []);

  // for graceful closing => user go away
  const closeConnection = useCallback(() => {
    reconnectTimeout.current && clearTimeout(reconnectTimeout.current);
    heartBeatRef.current && clearInterval(heartBeatRef.current);
    wsRef.current?.close();
  }, []);

  useEffect(() => {
    // on comp mount connect
    connect();
    // on comp unmount close connection
    return () => {
      closeConnection();
    };
  }, [connect]);

  return { sendMessage, isConnected, close: closeConnection };
};
