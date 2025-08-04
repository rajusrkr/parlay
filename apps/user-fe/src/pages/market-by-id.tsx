import { useMarketStore } from "@/stores/useMarketStore";
import { Circle } from "lucide-react";
import { useParams } from "react-router";

export default function MarketById() {
  const { markets } = useMarketStore();

  const marketIdFromParams = useParams().id;

  return (
    <div className="py-4 max-w-7xl mx-auto px-4">
      {markets
        .filter((market) => market.marketId === marketIdFromParams)
        .map((mrkt, i) => (
          <div key={i}>
            {/* Left side */}
            <div className="space-y-2.5">
                <div className="flex gap-4 items-center">
                    <img src={mrkt.thumbnailImage} alt="Thumbnail Image" className="w-20 h-20 object-contain"/>
                    <Circle fill="#a6e884" size={50} color="#a6e884"/>
                    <p className="text-3xl font-semibold w-7xl">{mrkt.marketTitle}</p>
                </div>

                <div>
                    <p className="bg-yellow-200 w-80">End Date: {new Date(mrkt.marketEnds).toLocaleString()}</p>
                </div>

                {/* Outcomes */}
                <div>
                       <div className="flex justify-between max-w-lg border border-t-2 border-b-2 border-l-0 border-r-0 py-2 px-1">
                            <p>Outcome</p>
                            <p>Chance %</p>
                            <p>Current Price</p>
                        </div> 

                        <div>
                            {mrkt.prices.map((prc) => (
                                <div>
                                    <p>{(prc.yes).value}</p>
                                </div>
                            ))}


                            {/* 
                            {mrkt.prices.map((price) => (
                                <div>
                                    <p> {price.side} </p>
                                    <p> {price.value} </p>
                                    <p> {price.chance} </p>
                                </div>
                            ))}
                            
                            */}
                        </div>
                </div>
            </div>

            {/* Rigth side */}
            <div>

            </div>
          </div>
        ))}
    </div>
  );
}
