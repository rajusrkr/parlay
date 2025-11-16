// WILL IMPROVE THIS CODE LATER
// TODO: add re-connect logic
// Message handling

class WS {
  private wsRef: WebSocket | null = null;
  private isConnected: boolean = false;

  private url: string;
  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.isConnected && this.wsRef !== null) {
      console.warn("Already connected");
      return;
    }
    const ws = new WebSocket(this.url);
    this.wsRef = ws;
    this.isConnected = true;
    console.log("WS CONNECTED");

    this.wsRef.onmessage = (msg) => {
      console.log(JSON.parse(msg.data));
    };

    this.wsRef.onopen = () => {
      this.wsRef?.send(JSON.stringify({ type: "authHandShake" }));
    };
  }

  distconnect() {
    if (this.wsRef && this.isConnected) {
      console.log("Closing...");
      this.wsRef.close(1000, "Manual closing");
      this.wsRef = null;
      this.isConnected = false;
      return;
    }
    console.log("Connection already closed");
  }
}

export { WS };
