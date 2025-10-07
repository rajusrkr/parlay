import { useParams } from "react-router";
import MarketEditForm from "../components/MarketEditForm";
import { useAdminStore } from "../store/adminStore";

export default function EditMarket() {
  const { markets } = useAdminStore();
  const marketId = useParams().id;
  const marketData = markets.filter((mrkt) => mrkt.marketId === marketId)[0];

  return (
    <div>
      <MarketEditForm marketData={marketData} />
    </div>
  );
}
