import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useMarketStore } from "@/stores/useMarketStore";
import { useEffect } from "react";
import { Link } from "react-router";

export default function Markets() {
  const { fetchMarkets, markets } = useMarketStore();

  const ws = new WebSocket("ws://localhost:8001");

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    console.log(data);
    

  };

  useEffect(() => {
    (async () => {
      await fetchMarkets();
    })();

    const connectToWs = () => {
      console.log("wss");

      const wsData = { eventName: "client-connection" };

      ws.onopen = () => {
        ws.send(JSON.stringify({ wsData }));
      };
    };

    connectToWs();
  }, []);

  return (
    <div className="w-80 flex flex-col space-y-4 px-10">
      {markets.map((market, i) => (
        <Card key={i} className="p-2">
          <Link to={`/market/${market.marketId}`}>
            <CardTitle>{market.marketTitle}</CardTitle>
          </Link>
          <CardContent>
            <p>Market Status: {market.currentStatus}</p>
           
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
