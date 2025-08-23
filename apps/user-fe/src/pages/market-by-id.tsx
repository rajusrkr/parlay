import { Badge } from "@/components/ui/badge";
import { useMarketStore } from "@/stores/useMarketStore";
import { useParams } from "react-router";

export default function MarketById() {
  const { markets } = useMarketStore();

  const marketIdFromParams = useParams().id;

  return (
    <div className="py-4 max-w-7xl mx-auto px-4">
      <div>
        {markets
          .filter((market) => market.marketId === marketIdFromParams)
          .map((filteredMarket, i) => (
            <div key={i}>
              {/* Right side */}
              <div>
                {/* Title */}
                <div className="flex gap-2">
                  <div>
                    <img
                      src={filteredMarket.thumbnailImage}
                      alt="market thumbnail image"
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-3xl">{filteredMarket.marketTitle}</h3>
                    <Badge>
                      <span className="capitalize">
                        {filteredMarket.marketCategory}
                      </span>
                    </Badge>
                  </div>
                </div>

                {/* Outcomes */}
                <div>
                  <div>
                    <div>
                      <div>
                        <h3 className="text-2xl">Outcome</h3>
                      </div>
                      {filteredMarket.outcomesAndPrices.map((outcmsAndPrc, i) => (
                          <p key={i} className="capitalize">{outcmsAndPrc.outcome}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Left side */}
              <div></div>
            </div>
          ))}
      </div>
    </div>
  );
}
