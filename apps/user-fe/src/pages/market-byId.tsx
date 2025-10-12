import { useParams } from "react-router";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
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
import {
  type MarketByIdInterface,
  type OutcomeInterface,
} from "@repo/shared/src";
import { useEffect, useMemo, useState } from "react";
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
    <div className="md:col-span-2">
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

function OrderPanel({
  marketId,
  outcomes,
}: {
  marketId: string;
  outcomes: OutcomeInterface[];
}) {
  const [selectedOutcome, setSelectedOutcome] = useState<string | undefined>(
    undefined
  );
  const [betQty, setBetQty] = useState<number | undefined>(undefined);

  // Get btn status => btn disabled or not
  const isBetBtnDisabled = useMemo(() => {
    if (
      typeof selectedOutcome === "undefined" ||
      typeof betQty === "undefined" ||
      betQty < 1
    ) {
      return true;
    }
    return false;
  }, [selectedOutcome, betQty]);

  return (
    <div className="flex-1">
      <Card className="max-w-3xl">
        <CardHeader className="text-lg font-semibold">
          Place Your Bet
        </CardHeader>
        <Divider />
        <CardBody>
          <h4 className="font-semibold text-default-500">Select an outcome:</h4>
          <div className="flex flex-col gap-2 mt-2">
            {outcomes.map((otcms, i) => (
              <Button
                key={i}
                className="w-full justify-between"
                variant={selectedOutcome === otcms.title ? "solid" : "bordered"}
                color={selectedOutcome === otcms.title ? "primary" : "default"}
                onPress={() => {
                  setSelectedOutcome(otcms.title);
                }}
              >
                <span>{otcms.title}</span>
                <Chip
                  color={
                    selectedOutcome === otcms.title ? "primary" : "default"
                  }
                  variant={selectedOutcome === otcms.title ? "faded" : "solid"}
                >
                  {otcms.price}
                </Chip>
              </Button>
            ))}
          </div>
          <Divider className="my-4" />
          <div>
            <h4 className="font-semibold text-default-500">Bet Qty:</h4>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[50, 100, 150, 200, 250, 300].map((bqty, i) => (
                <Button
                  key={i}
                  variant={betQty === bqty ? "solid" : "light"}
                  color={betQty === bqty ? "primary" : "default"}
                  onPress={() => {
                    setBetQty(bqty);
                  }}
                >
                  {bqty}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-default-500">
              Enter custom Qty:
            </h4>
            <Input
              type="number"
              placeholder="Enter your qty"
              className="mt-2"
              value={betQty?.toString()}
              onChange={(e) => {
                setBetQty(Number(e.target.value));
              }}
            />
          </div>
            <div className="mt-4 text-default-500 font-semibold text-sm">
            {
              typeof selectedOutcome !== "undefined" && typeof betQty !== "undefined" && (
                <div>
                  <p>Your selection is: {selectedOutcome}</p>
                  <p>Your Quantity is: {betQty}</p>
                </div>
              )
            }
          </div>

          <div className="mt-4">
            <Button
              className="w-full font-semibold"
              color="primary"
              isDisabled={isBetBtnDisabled}
            >
              Place Bet
            </Button>
          </div>

        
        </CardBody>
      </Card>
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
      {typeof marketById !== "undefined" && <PageHeader market={marketById} />}

      {typeof marketById !== "undefined" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-8">
          <ContentTabs market={marketById} />
          <OrderPanel
            marketId={marketById.marketId}
            outcomes={marketById.outcomes}
          />
        </div>
      )}
    </div>
  );
}
