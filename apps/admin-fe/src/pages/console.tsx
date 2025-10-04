import { useEffect, useMemo, useState } from "react";
import { useAdminStore } from "../store/adminStore";
import {
  Button,
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
  Landmark,
  Lock,
  LockOpen,
  Timer,
  Trophy,
} from "lucide-react";
import MarketCards from "../components/MarketCards";

export default function Console() {
  const { fetchAllMarkets, setMarketFilters, marketFilter } = useAdminStore();

  const marketFilters = [
    { title: "Open", key: "open", icons: <LockOpen size={20} /> },
    { title: "Open soon", key: "not_started", icons: <Timer /> },
    { title: "Closed", key: "closed", icons: <Lock size={20} /> },
    { title: "Settled", key: "settled", icons: <CircleCheckBig size={20} /> },
    { title: "All", key: "all", icons: <GalleryVerticalEnd size={20} /> },
  ];
  const marketCategory = [
    { title: "Sports", key: "sports", icon: <Trophy size={20} /> },
    { title: "Politics", key: "politics", icon: <Landmark size={20} /> },
    { title: "Crypto", key: "crypto", icon: <Bitcoin size={20} /> },
  ];

  const [selectedKeys, setSelectedKeys] = useState(
    new Set(marketFilter.categories)
  );
  const [selectedFiler, setSelectedFilter] = useState(marketFilter.status);

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", "),
    [selectedKeys]
  );

  useEffect(() => {
    setMarketFilters({
      status: selectedFiler,
      categories: Array.from(selectedKeys),
    });
  }, [selectedKeys, selectedFiler]);

  useEffect(() => {
    (async () => {
      await fetchAllMarkets();
    })();
  }, []);

  return (
    <div>
      <div className="mt-4">
        <h1 className="text-4xl font-semibold">Markets</h1>
        <p className="text-xs font-semibold mt-1 text-default-500">
          View, Filter, Edit, Delete markets
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8">
        {/* Left filter section */}
        <div>
          <h2 className="text-lg font-medium mb-2">Filters</h2>
          <div>
            <Tabs
              aria-label="market filters"
              color="secondary"
              variant="light"
              className="flex flex-wrap"
              defaultSelectedKey={marketFilter.status}
            >
              {marketFilters.map((filter) => (
                <Tab
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
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
          <h1 className="text-lg font-medium mb-2">Categories</h1>
          <Dropdown>
            <DropdownTrigger>
              <Button
                className="capitalize"
                variant="bordered"
                color="secondary"
                size="md"
              >
                <span className="font-semibold">{selectedValue}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Multiple selection example"
              closeOnSelect={false}
              selectedKeys={selectedKeys}
              selectionMode="multiple"
              variant="flat"
              onSelectionChange={(keys) => {
                setSelectedKeys(new Set(keys as Iterable<string>));
              }}
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
      <div>
        <MarketCards />
      </div>
    </div>
  );
}
