import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useMarketStore } from "@/stores/useMarketStore";
import { useEffect } from "react";

export default function Markets() {
  const { fetchMarkets, markets, handleWsPriceChange } = useMarketStore();

  const ws = new WebSocket("ws://localhost:8001")

  ws.onmessage = (msg) => {
    console.log("new message");
    
    console.log(msg.data);

const data = JSON.parse(msg.data)


handleWsPriceChange({marketId: data.marketId, noPrice: data.no, yesPrice: data.yes})

    
  }



  useEffect(() => {
    (async () => {
      await fetchMarkets();
    })();

    const connectToWs = () => {
      console.log("wss");
      

      const wsData = {eventName: "client-connection"}

      ws.onopen = () => {
        ws.send(JSON.stringify({wsData}))
      }

    }

    connectToWs()
  }, []);

  return (
    <div className="w-80 flex flex-col space-y-4 px-10">
      {markets.map((market, i) => (
        <Card key={i} className="p-2">
          <CardTitle>{market.marketTitle}</CardTitle>
          <CardContent>
            <p>Market Status: {market.currentStatus}</p>
            <p>No side price: {market.priceData.noSide}</p>
            <p>Yes side price: {market.priceData.yesSide}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
