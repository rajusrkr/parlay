import OrderPlaceBtn from "@/components/order-place-btn";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    // The main div for adjusting width
    <div className="max-w-7xl mx-auto p-4">
      {/* The div that holds all the cards */}
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
        {markets.map((market, i) => (
          // The div for each card
          <div
            key={i}
            className="border-2 border-primary shadow-[4px_3px_1px_#909399] p-4 flex flex-col justify-between h-[280px] bg-secondary"
          >
            {/* Title */}
            <div>
              <div>
                <Link to={`/market/${market.marketId}`}>
                  <span className="flex items-center gap-2 mb-2">
                    <img
                      src={market.thumbnailImage}
                      alt="Market Thumbnail"
                      className="w-20 h-12 object-contain"
                    />
                    <p className="font-semibold text-2xl">
                      {market.marketTitle}
                    </p>
                  </span>
                </Link>
              </div>

              <div>
                <div className="space-x-1">
                  <Badge>
                    <span className="capitalize font-semibold text-[14px]">
                      {market.marketCategory}
                    </span>
                  </Badge>
                  <Badge>
                    <span className="capitalize font-semibold text-[14px]">
                      {market.marketType}
                    </span>
                  </Badge>
                  <Badge
                    variant={"secondary"}
                    className="bg-blue-500 text-white"
                  >
                    <span className="capitalize font-semibold text-[14px]">{`${new Date(market.marketEnds * 1000).toLocaleString()}`}</span>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto custom-scroll">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xl">Outcome</TableHead>
                    <TableHead className="text-xl">Price</TableHead>
                    <TableHead className="text-xl">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {market.outcomesAndPrices.map((otcms, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-lg capitalize">
                        {otcms.outcome}
                      </TableCell>
                      <TableCell className="text-lg">{otcms.price}</TableCell>
                      <TableCell>
                        <OrderPlaceBtn isBuy={true} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
