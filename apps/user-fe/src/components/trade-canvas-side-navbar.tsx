import { BadgeDollarSign, Diff } from "lucide-react";
import { Button } from "./ui/button";

export default function TradeCanvasSideNavbar() {
  return (
    <div className="bg-orange-50 h-[100vh] w-16 fixed right-0 shadow-md border flex justify-center">
      <div className="mt-10 space-y-2">
        <div className="flex flex-col justify-center">
          <Button className="border-2 border-orange-500 hover:cursor-pointer">
            <Diff />
          </Button>
          <p className="text-sm font-semibold">Buy/Sell</p>
        </div>

        <div className="flex flex-col justify-center">
          <Button className="border-2 border-orange-500 hover:cursor-pointer">
            <BadgeDollarSign />
          </Button>
          <p className="text-sm font-semibold">Positions</p>
        </div>
      </div>
    </div>
  );
}
