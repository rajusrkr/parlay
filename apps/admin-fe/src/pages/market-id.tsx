import { useNavigate, useParams } from "react-router";
import { useAdminStore } from "../store/adminStore";
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import {
  Bitcoin,
  Calendar,
  CircleCheckBig,
  Clock1,
  Clock10,
  Landmark,
  Lock,
  LockOpen,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { dateFormater } from "../utils/lib";
import { useEffect } from "react";

export default function MarketById() {
  const { markets, getMarketById } = useAdminStore();

  const marketId = useParams().id;
  const filteredMarket = markets.filter(
    (mrkt) => mrkt.marketId === marketId
  )[0];

  useEffect(() => {
    (async () => {
      await getMarketById({ marketId: marketId! });
    })();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <div className="my-4 flex justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-0.5 text-default-500">
            <Calendar size={16} /> Created:{" "}
            {dateFormater({ timestamp: filteredMarket.marketStarts })}
          </span>
          <span className="flex items-center gap-0.5 text-default-500">
            <Clock1 size={16} /> Ends:{" "}
            {dateFormater({ timestamp: filteredMarket.marketEnds })}
          </span>
        </div>
        <div>
          <Button
            size="sm"
            onPress={async () => {
              await getMarketById({ marketId: marketId! });
            }}
          >
            <RefreshCw className="text-default-500" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="mb-3 space-x-2">
          {/* Status */}
          {filteredMarket.currentStatus === "not_started" && (
            <Chip variant="flat">
              <span className="flex items-center gap-0.5">
                <Clock10 size={16} /> Open soon
              </span>
            </Chip>
          )}
          {filteredMarket.currentStatus === "open" && (
            <Chip variant="flat" color="success">
              <span className="flex items-center gap-0.5">
                <LockOpen size={16} /> Open
              </span>
            </Chip>
          )}

          {filteredMarket.currentStatus === "settled" && (
            <Chip variant="flat" color="primary">
              <span className="flex items-center gap-0.5">
                <CircleCheckBig size={16} /> Settled
              </span>
            </Chip>
          )}
          {filteredMarket.currentStatus === "closed" && (
            <Chip variant="flat" color="warning">
              <span className="flex items-center gap-0.5">
                <Lock size={16} /> Closed
              </span>
            </Chip>
          )}
          {/* category */}
          {filteredMarket.marketCategory === "crypto" && (
            <Chip variant="flat">
              <span className="flex items-center gap-0.5">
                <Bitcoin size={16} /> Crypto
              </span>
            </Chip>
          )}

          {filteredMarket.marketCategory === "politics" && (
            <Chip variant="flat">
              <span className="flex items-center gap-0.5">
                <Landmark size={16} /> Politics
              </span>
            </Chip>
          )}

          {filteredMarket.marketCategory === "sports" && (
            <Chip variant="flat">
              <span className="flex items-center gap-0.5">
                <Trophy size={16} /> Sports
              </span>
            </Chip>
          )}
        </div>
        <div>
          <Button
            size="sm"
            radius="full"
            color="secondary"
            onPress={() =>
              navigate(`/admin/market/edit/${filteredMarket.marketId}`)
            }
          >
            <span className="font-semibold">Edit</span>
          </Button>
        </div>
      </div>
      <div>
        <h1 className="text-3xl font-semibold">{filteredMarket.title}</h1>
        <p className="text-default-500 mt-2">{filteredMarket.description}</p>
        <p className="text-default-500 mt-2 capitalize">{`Settlement: ${filteredMarket.settlement}`}</p>
      </div>

      <div className="mt-4">
        <Table className="max-w-2xl" aria-label="outcome-table">
          <TableHeader>
            <TableColumn>Outcome</TableColumn>
            <TableColumn>Price</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredMarket.outcomes?.map((fltr, i) => (
              <TableRow key={i}>
                <TableCell className="capitalize">{fltr.outcome}</TableCell>
                <TableCell>{fltr.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
