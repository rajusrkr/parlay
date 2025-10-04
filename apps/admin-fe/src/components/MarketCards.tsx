import {
  Card,
  CardBody,
  CardFooter,
  Chip,
} from "@heroui/react";
import { useAdminStore } from "../store/adminStore";
import {
  Bitcoin,
  Calendar,
  CircleCheckBig,
  Clock1,
  Hourglass,
  Landmark,
  Lock,
  LockOpen,
  Trophy,
} from "lucide-react";
import { dateFormater } from "../utils/lib";
import { Link } from "react-router";

export default function MarketCards() {
  const { markets, marketFilter } = useAdminStore();
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-4 p-1">
      {markets
        .filter(
          (mrkt) =>
            mrkt.currentStatus === marketFilter.status &&
            marketFilter.categories.includes(mrkt.marketCategory)
        )
        .map((market, i) => (
          <Card key={i}>
            <CardBody>
              {/* status and category */}
              <div className="flex justify-between mb-2">
                {/* MARKET STATUS */}
                {market.currentStatus === "not_started" && (
                  <Chip color="default" variant="flat">
                    <span className="capitalize flex items-center">
                      <Hourglass size={16} /> Open soon
                    </span>
                  </Chip>
                )}
                {market.currentStatus === "open" && (
                  <Chip color="success" variant="flat">
                    <span className="capitalize flex items-center gap-0.5">
                      <LockOpen size={16} /> Open
                    </span>
                  </Chip>
                )}
                {market.currentStatus === "closed" && (
                  <Chip color="warning" variant="flat">
                    <span className="capitalize flex items-center gap-0.5">
                      <Lock size={16} /> Closed
                    </span>
                  </Chip>
                )}

                {market.currentStatus === "settled" && (
                  <Chip color="primary" variant="flat">
                    <span className="capitalize flex items-center gap-0.5">
                      <CircleCheckBig size={16} /> Settled
                    </span>
                  </Chip>
                )}
                {/* MARKET CATEGORY */}
                {market.marketCategory === "sports" && (
                  <Chip variant="flat">
                    <span className="capitalize flex items-center gap-0.5">
                      <Trophy size={16} />
                      {market.marketCategory}
                    </span>
                  </Chip>
                )}
                {market.marketCategory === "crypto" && (
                  <Chip variant="flat">
                    <span className="capitalize flex items-center gap-0.5">
                      <Bitcoin size={16} />
                      {market.marketCategory}
                    </span>
                  </Chip>
                )}

                {market.marketCategory === "politics" && (
                  <Chip variant="flat">
                    <span className="capitalize flex items-center gap-0.5">
                      <Landmark size={16} />
                      {market.marketCategory}
                    </span>
                  </Chip>
                )}
              </div>
              {/* title, descriptio and closing */}
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  {market.marketTitle}
                </h2>
                <p className="text-sm text-default-500 truncate mb-4">
                  {market.marketOverview}
                </p>
                <p
                  className="flex items-center text-default-500 text-xs
                gap-0.5"
                >
                  <Calendar size={15} />
                  <span>
                    Created: {dateFormater({ timestamp: market.marketStarts })}
                  </span>
                </p>
                <p
                  className="flex items-center text-default-500 text-xs
                gap-0.5 mt-1"
                >
                  <Clock1 size={15} />
                  <span>
                    Closing: {dateFormater({ timestamp: market.marketEnds })}
                  </span>
                </p>
              </div>
            </CardBody>

            <CardFooter>
              <Link to={`/admin/market/${market.marketId}`}>
                <Chip
                  radius="sm"
                  color="primary"
                  variant="light"
                  className="hover:bg-primary-50 transition-all"
                >
                  Details
                </Chip>
              </Link>
            </CardFooter>
          </Card>
        ))}

      {marketFilter.status === "all" &&
        markets
          .filter((mrkt) =>
            marketFilter.categories.includes(mrkt.marketCategory)
          )
          .map((market, i) => (
            <Card key={i}>
              <CardBody>
                {/* status and category */}
                <div className="flex justify-between mb-2">
                  {/* MARKET STATUS */}
                  {market.currentStatus === "not_started" && (
                    <Chip color="default" variant="flat">
                      <span className="capitalize flex items-center">
                        <Hourglass size={16} /> Open soon
                      </span>
                    </Chip>
                  )}
                  {market.currentStatus === "open" && (
                    <Chip color="success" variant="flat">
                      <span className="capitalize flex items-center gap-0.5">
                        <LockOpen size={16} /> Open
                      </span>
                    </Chip>
                  )}
                  {market.currentStatus === "closed" && (
                    <Chip color="warning" variant="flat">
                      <span className="capitalize flex items-center gap-0.5">
                        <Lock size={16} /> Closed
                      </span>
                    </Chip>
                  )}

                  {market.currentStatus === "settled" && (
                    <Chip color="primary" variant="flat">
                      <span className="capitalize flex items-center gap-0.5">
                        <CircleCheckBig size={16} /> Settled
                      </span>
                    </Chip>
                  )}
                  {/* MARKET CATEGORY */}
                  {market.marketCategory === "sports" && (
                    <Chip variant="flat">
                      <span className="capitalize flex items-center gap-0.5">
                        <Trophy size={16} />
                        {market.marketCategory}
                      </span>
                    </Chip>
                  )}
                  {market.marketCategory === "crypto" && (
                    <Chip variant="flat">
                      <span className="capitalize flex items-center gap-0.5">
                        <Bitcoin size={16} />
                        {market.marketCategory}
                      </span>
                    </Chip>
                  )}

                  {market.marketCategory === "politics" && (
                    <Chip variant="flat">
                      <span className="capitalize flex items-center gap-0.5">
                        <Landmark size={16} />
                        {market.marketCategory}
                      </span>
                    </Chip>
                  )}
                </div>
                {/* title, descriptio and closing */}
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    {market.marketTitle}
                  </h2>
                  <p className="text-sm text-default-500 truncate mb-4">
                    {market.marketOverview}
                  </p>
                  <p
                    className="flex items-center text-default-500 text-xs
                gap-0.5"
                  >
                    <Calendar size={15} />
                    <span>
                      Created: {dateFormater({ timestamp: market.marketStarts })}
                    </span>
                  </p>
                  <p
                    className="flex items-center text-default-500 text-xs
                gap-0.5 mt-1"
                  >
                    <Clock1 size={15} />
                    <span>
                      Closing: {dateFormater({ timestamp: market.marketEnds })}
                    </span>
                  </p>
                </div>
              </CardBody>
              <CardFooter>
                <Link to={`/admin/market/${market.marketId}`}>
                  <Chip
                    radius="sm"
                    color="primary"
                    variant="light"
                    className="hover:bg-primary-50 transition-all"
                  >
                    Details
                  </Chip>
                </Link>
              </CardFooter>
            </Card>
          ))}
    </div>
  );
}
