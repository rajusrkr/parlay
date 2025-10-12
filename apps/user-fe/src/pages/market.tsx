import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import {
  Bitcoin,
  CircleCheckBig,
  GalleryVerticalEnd,
  Hourglass,
  Landmark,
  Lock,
  LockOpen,
  Timer,
  Trophy,
} from "lucide-react";
import { dateFormater } from "../lib/utils";
import { Link } from "react-router";
import { useUserStore } from "../store/userStore";

export default function Market() {
  const { markets, fetchAllMarkets } = useUserStore();

  const marketFilters = [
    { title: "Open", key: "open", icons: <LockOpen size={20} /> },
    { title: "Open soon", key: "open-soon", icons: <Timer /> },
    { title: "Closed", key: "closed", icons: <Lock size={20} /> },
    { title: "Settled", key: "settled", icons: <CircleCheckBig size={20} /> },
    { title: "All", key: "all", icons: <GalleryVerticalEnd size={20} /> },
  ];
  const marketCategory = [
    { title: "All", key: "all", icon: <GalleryVerticalEnd size={20} /> },
    { title: "Sports", key: "sports", icon: <Trophy size={20} /> },
    { title: "Politics", key: "politics", icon: <Landmark size={20} /> },
    { title: "Crypto", key: "crypto", icon: <Bitcoin size={20} /> },
  ];

  const [selectedKeys, setSelectedKeys] = useState(new Set(["all"]));
  console.log(selectedKeys);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  useEffect(() => {
    (async () => {
      await fetchAllMarkets();
    })();
  }, []);

  return (
    <div className="mt-4">
      {/* Head */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Betting Markets
        </h1>
        <p className="text-default-500">
          Explore and place bets on various markets
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left filter section */}
        <div>
          <h2 className="text-lg font-medium mb-2">Filters</h2>
          <div>
            <Tabs
              aria-label="market filters"
              color="primary"
              variant="light"
              className="flex flex-wrap"
            >
              {marketFilters.map((filter) => (
                <Tab
                  key={filter.key}
                  title={
                    <div className="flex justify-center items-center gap-1">
                      {filter.icons}
                      <span>{filter.title}</span>
                    </div>
                  }
                />
              ))}
            </Tabs>
          </div>
        </div>
        {/* Right filter section */}
        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button className="capitalize" variant="bordered">
                {selectedValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Multiple selection example"
              closeOnSelect={false}
              selectedKeys={selectedKeys}
              selectionMode="multiple"
              variant="flat"
              onSelectionChange={(keys) =>
                setSelectedKeys(new Set(keys as Iterable<string>))
              }
            >
              {marketCategory.map((category) => (
                <DropdownItem key={category.key} startContent={category.icon}>
                  {category.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* market lists */}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-4 p-1">
        {markets.map((market, i) => (
          <Card key={i}>
            <CardBody>
              {/* status and category */}
              <div className="flex justify-between mb-2">
                {market.currentStatus === "open" && (
                  <Chip color="success" variant="flat">
                    <span className="capitalize flex items-center gap-1">
                      <LockOpen size={18} /> {market.currentStatus}
                    </span>
                  </Chip>
                )}

                {market.currentStatus === "settled" && (
                  <Chip color="secondary" variant="flat">
                    <span className="capitalize flex items-center gap-1">
                      <CircleCheckBig size={18} /> {market.currentStatus}
                    </span>
                  </Chip>
                )}
                {market.currentStatus === "closed" && (
                  <Chip color="danger" variant="flat">
                    <span className="capitalize flex items-center gap-1">
                      <Lock size={18} /> {market.currentStatus}
                    </span>
                  </Chip>
                )}

                 {market.currentStatus === "open-soon" && (
                  <Chip color="danger" variant="flat">
                    <span className="capitalize flex items-center gap-1">
                      <Timer size={18} /> {market.currentStatus}
                    </span>
                  </Chip>
                )}


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
              <div className="mb-4">
                <Link to={`/market/${market.marketId}`}><span className="text-lg font-semibold mb-2 hover:underline">{market.title}</span></Link>
                <p className="text-sm text-default-500 truncate mb-4">
                  {market.description}
                </p>
                <p
                  className="flex items-center text-default-500 text-xs
                gap-0.5"
                >
                  <Hourglass size={14} />
                  <span>
                    Closes: {dateFormater({ timestamp: market.marketEnds })}
                  </span>
                </p>
              </div>

              {/* outcomes and prices*/}
              <div className="flex flex-col space-y-3">
                {market.outcomes!.slice(0, 2).map((outcms) => (
                  <Button key={outcms.title} variant="bordered">
                    <span className="capitalize">{outcms.title}</span>
                  </Button>
                ))}
              </div>
              <div className="mt-1">
                <Chip
                  color="default"
                  variant="light"
                  radius="sm"
                  className="hover:bg-default-100 transition-all"
                >
                  <span>
                    {market.outcomes!.length > 2 && (
                      <Link to={"/market/id"}>
                        <span className="text-primary font-semibold text-xs">
                          View more options
                        </span>
                      </Link>
                    )}
                  </span>
                </Chip>
              </div>
            </CardBody>

            {/* Footer */}
            <Divider className="my-2" />
            <CardFooter className="mt-auto">
              <Button className="">Place bet</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
