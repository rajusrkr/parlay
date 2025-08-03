import OrderPlaceBtn from "@/components/order-place-btn";
import { useWebsocket } from "@/hooks/useWebSocket";
import { useMarketStore } from "@/stores/useMarketStore";
import { useEffect } from "react";
import { Link } from "react-router";

export default function Markets() {
  const { fetchMarkets, markets } = useMarketStore();
  const { connect, disconnect } = useWebsocket();

  useEffect(() => {
    (async () => {
      await fetchMarkets();
    })();

    // Connect to ws server
    connect();

    // Disconnect on umount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* For good responsiveness */}
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
        {
          markets.map((market, i) => (
            <div key={i} className="border-2 border-black p-4 flex flex-col justify-between h-[260px]">
              <Link to={`/market/${market.marketId}`}>
                <span className="flex gap-2 mb-2">
                  <img src={market.thumbnailImage} alt="Market Thumbnail" className="w-20 h-12 object-contain"/>
                  <p className="font-semibold">{market.marketTitle}</p>
                </span>
              </Link>
              <div className="flex gap-2.5 mt-auto pt-2">
                <OrderPlaceBtn height="10" width="48" isBuy={true}/>
                <OrderPlaceBtn height="10" width="48" isBuy={false}/>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
