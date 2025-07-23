import { RectangleEllipsis, TrendingUpDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import TradeCanvasSidePanel from "./trade-canvas-side-panel";

export default function TradeCanvasSideNavbar() {
  const [isBuy, setIsBuy] = useState(true);
  const [isPosition, setIsPosition] = useState(false);
  return (
    <div>
      <div className="bg-gray-200 h-[100vh] w-18 fixed right-0 shadow-md border flex justify-center">
        <div className="mt-10 space-y-2">
          <div className="flex flex-col justify-center">
            <Button
              className={`border-2 hover:cursor-pointer ${isBuy && "border-orange-500"}`}
              onClick={() => {
                setIsPosition(false);
                setIsBuy(true);
              }}
            >
              <RectangleEllipsis />
            </Button>
            <p className="text-sm font-semibold">Buy now</p>
          </div>

          <div className="flex flex-col justify-center">
            <Button
              className={`border-2 hover:cursor-pointer ${isPosition && "border-orange-500"}`}
              onClick={() => {
                setIsBuy(false);
                setIsPosition(true);
              }}
            >
              <TrendingUpDown />
            </Button>
            <p className="text-sm font-semibold">Positions</p>
          </div>
        </div>
      </div>
      <TradeCanvasSidePanel isBuy = {isBuy} isPosition = {isPosition}/>
    </div>
  );
}
