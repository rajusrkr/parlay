import { useuserStore } from "@/stores/useUserStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useMarketStore } from "@/stores/useMarketStore";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";

export default function ShowAllPositions() {
  const { positions } = useuserStore();
  const { markets } = useMarketStore();

  const [exitOrder, setExitOrder] = useState<{ qty: number; marketId: string }>(
    { qty: 0, marketId: "" }
  );
  console.log(exitOrder);

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
              <div
                key={position.marketId}
                className="bg-gray-200 p-2 rounded-md shadow-md"
              >
                <p>
                  Market:{" "}
                  <span className="capitalize font-semibold">
                    {position.marketId}
                  </span>
                </p>
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
                  Current PNL:{" "}
                  <span className="capitalize font-semibold">
                    {markets.map((market) =>
                      market.marketId === position.marketId ? (
                        <>
                          {Math.round(
                            market.prices[market.prices.length - 1].yes.value *
                              Number(position.totalQty)
                          ) -
                            position.totalQty * Number(position.avgPrice)}
                        </>
                      ) : (
                        <></>
                      )
                    )}{" "}
                  </span>
                </p>



                {/* exit order section */}

                <div className="flex gap-2">
                  <Input
                    placeholder="Quantity"
                    className="bg-white"
                    value={
                      position.marketId === exitOrder.marketId
                        ? exitOrder.qty
                        : 0
                    }
                    onChange={(e) =>
                      setExitOrder({
                        marketId: position.marketId,
                        qty: Number(e.target.value),
                      })
                    }
                  />
                  <Button
                    className="w-20"
                    disabled={
                      exitOrder.marketId !== position.marketId &&
                      exitOrder.qty > 0
                    }
                  >
                    Exit
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Checkbox
                    className="bg-white"
                    checked={exitOrder.qty === position.totalQty}
                    onCheckedChange={(checked) => {
                      checked
                        ? setExitOrder({
                            marketId: position.marketId,
                            qty: position.totalQty,
                          })
                        : setExitOrder({ marketId: "", qty: 0 });
                    }}
                  />
                  <p className="font-semibold text-sm text-black/60">
                    Avaialble {position.totalQty}
                  </p>
                </div>
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
