import { useuserStore } from "@/stores/useUserStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useMarketStore } from "@/stores/useMarketStore";

export default function ShowAllPositions() {
  const { positions } = useuserStore();
  const { markets } = useMarketStore();

  return (
    <div>
      <div>
        <h4 className="font-bold">All positions</h4>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
          <CardDescription>
            All your positions will appear below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-2 p-">
            {positions.map((position) => (
              <div key={position.marketId} className="bg-gray-200 p-2 rounded-md">
                <p>
                  Side:{" "}
                  <span className="capitalize font-semibold">
                    {position.side}
                  </span>
                </p>
                <p>
                  Average price:{" "}
                  <span className="capitalize font-semibold">
                    {position.avgPrice}
                  </span>
                </p>

                {/* calculate pl */}

                <p>
                  Qty:{" "}
                  <span className="capitalize font-semibold">
                    {position.totalQty}
                  </span>
                </p>
                <p>
                  You have paid:{" "}
                  <span className="capitalize font-semibold">
                    {position.totalQty * Number(position.avgPrice)}
                  </span>
                </p>

                <p>
                  Current PNL: <span className="capitalize font-semibold">
                    {markets.map((market) =>
                      market.marketId === position.marketId ? (
                        <>
                          {(Math.round(market.prices[market.prices.length - 1].yes.value *
                            Number(position.totalQty)))- (position.totalQty * Number(position.avgPrice))}
                        </>
                      ) : (
                        <></>
                      )
                    )}{" "}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/*

bought@100, 5 qty
currentPrice => 105


pl = current - bought => 5 * 5

*/
