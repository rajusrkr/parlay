import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useWebsocket } from "@/hooks/useWebSocket";
import { useMarketStore } from "@/stores/useMarketStore";
import { useEffect } from "react";
import { Link } from "react-router";

export default function Markets() {
  const { fetchMarkets, markets } = useMarketStore();
  const {isConnected, connect, disconnect} = useWebsocket()

  useEffect(() => {
    (async () => {
      await fetchMarkets();
    })();



    connect()

    return () => {disconnect()}
  }, [connect, disconnect]);

  return (
    <div className="w-80 flex flex-col space-y-4 px-10">
      {markets.map((market, i) => (
        <Card key={i} className="p-2">
          <Link to={`/market/${market.marketId}`}>
            <CardTitle>{market.marketTitle}</CardTitle>
          </Link>
          <CardContent>
            <p>Market Status: {market.currentStatus}</p>

            <div>
              {
                market.prices.map((price, i) => (
                  <p key={i}>{price.yes.value}</p>
                ))
              }
            </div>
          </CardContent>
        </Card>
      ))}
      <div>
        {isConnected ? "Connected 🟢" : "Not connected🔴"}
      </div>
    </div>
  );
}
