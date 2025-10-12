import { useParams } from "react-router";
import MarketEditForm from "../components/MarketEditForm";
import { useAdminStore } from "../store/adminStore";
import { useEffect } from "react";

export default function EditMarket() {
  const { fetchMarketById, marketById, isMarketFetching } = useAdminStore();
  const marketId = useParams().id;

  useEffect(() => {
    (async () => {
      await fetchMarketById({ marketId: marketId! });
    })();
  }, []);

  return (
    <div>
      {isMarketFetching && <p>Loading...</p>}
      {typeof marketById === "undefined" && <p>Error happended</p>}
      {typeof marketById !== "undefined" && (
        <MarketEditForm marketData={marketById} />
      )}
    </div>
  );
}
