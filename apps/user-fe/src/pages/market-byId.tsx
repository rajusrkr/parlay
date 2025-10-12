import { useParams } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Progress,
  Tab,
  Tabs,
} from "@heroui/react";
import {
  Bitcoin,
  Calendar,
  ChartLine,
  CircleCheckBig,
  Clock1,
  Hourglass,
  Landmark,
  LayoutDashboard,
  Lock,
  LockOpen,
  MessageSquare,
  Trophy,
} from "lucide-react";
import { dateFormater } from "../lib/utils";
import { type MarketByIdInterface } from "@repo/shared/src";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";

function PageHeader({ market }: { market: MarketByIdInterface }) {
  return (
    <div>
      {/* Status and category */}
      <div className="flex mb-2 gap-1">
        {/* MARKET STATUS */}
        {market.currentStatus === "open_soon" && (
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
      {/* Title and description */}
      <div className="mt-8">
        <div>
          <div>
            <h2 className="text-lg font-semibold mb-2">{market.title}</h2>
            <p className="text-sm text-default-500 truncate mb-4">
              {market.description}
            </p>
          </div>
          <div className="flex gap-4">
            <p>
              <span className="flex items-center text-default-500 text-xs gap-0.5">
                <Calendar size={15} />
                Created: {dateFormater({ timestamp: market?.marketStarts })}
              </span>
            </p>
            <p>
              <span className="flex items-center text-default-500 text-xs gap-0.5">
                <Clock1 size={15} />
                Closes: {dateFormater({ timestamp: market?.marketEnds })}
              </span>
            </p>
          </div>
        </div>
        {/* Market info will go here */}
        <div></div>
      </div>
    </div>
  );
}

function ContentTabs({ market }: { market: MarketByIdInterface }) {
  const marketTabs = [
    { key: "overview", title: "Overview" },
    { key: "chart", title: "Chart" },
    { key: "discussion", title: "Discussion" },
  ];

  const [selectedTabKey, setSelectedTabKey] = useState("overview");

  function OverViewTab() {
    return (
      <div>
        <div>
          <h3 className="text-lg font-semibold">Betting options</h3>
        </div>

        <div className="space-y-5 mt-5">
          {market.outcomes.map((otcms, i) => (
            <div key={i}>
              <div className="flex justify-between">
                <p>{otcms.title}</p>
                <Chip>
                  <span>{otcms.price}</span>
                </Chip>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Progress
                    value={20}
                    color="primary"
                    size="md"
                    aria-label="betting progress"
                  />
                </div>
                <span className="w-16 text-right">10%</span>
              </div>
              <div className="flex justify-between">
                <p className="text-default-500">{otcms.totalActiveBet} bets</p>
                <p className="text-default-500">
                  ₹{otcms.totalActiveVolume} volume
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div>
        <Card className="max-w-3xl">
          <CardHeader>
            <Tabs
              aria-label="Market tabs"
              selectedKey={selectedTabKey}
              onSelectionChange={(e) => {
                setSelectedTabKey(e.toString());
              }}
              variant="underlined"
              color="primary"
              classNames={{
                tabList: "gap-6",
              }}
            >
              {marketTabs.map((tab) => (
                <Tab
                  key={tab.key}
                  title={
                    <div className="flex gap-1">
                      <span>
                        {tab.key === "chart" && <ChartLine size={20} />}
                        {tab.key === "overview" && (
                          <LayoutDashboard size={20} />
                        )}
                        {tab.key === "discussion" && (
                          <MessageSquare size={20} />
                        )}
                      </span>
                      <span>{tab.title}</span>
                    </div>
                  }
                />
              ))}
            </Tabs>
          </CardHeader>
          <Divider />
          <CardBody>
            {selectedTabKey === "overview" && <OverViewTab />}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function MarketById() {
  const { fetchMarketById, marketById, isMarketFetching } = useUserStore();
  const matketId = useParams().id;

  useEffect(() => {
    (async () => {
      await fetchMarketById({ marketId: matketId! });
    })();
  }, []);

  return (
    <div>
      {isMarketFetching && <p>Loading...</p>}
      {typeof marketById === "undefined" && <p>Error happened</p>}
      {typeof marketById !== "undefined" && (
        <PageHeader market={marketById} />
      )}

      {typeof marketById !== "undefined" && (
        <ContentTabs market={marketById} />
      )}
    </div>
  );
}
