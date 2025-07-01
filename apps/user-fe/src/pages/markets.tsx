import { useMarketStore } from "@/stores/useMarketStore";
import { useEffect } from "react";

export default function Markets() {
  const { fetchMarkets } = useMarketStore();

  useEffect(() => {
    (async () => {
      await fetchMarkets();
    })();
  }, []);

  return <div>Markets</div>;
}
