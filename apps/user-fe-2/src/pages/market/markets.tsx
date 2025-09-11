import { useEffect } from "react";
import { usemarketStore } from "../../store/market";
import {
  marketFilter,
  type MarketCategoryEnum,
  type MarketStatusEnum,
} from "../../store/market-filter";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

export default function Markets() {
  const { fetchMarket, markets } = usemarketStore();
  const { marketCategory, marketStatus } = marketFilter();

  useEffect(() => {
    (async () => {
      await fetchMarket();
    })();
  }, []);

  return (
    <div>
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-4 max-w-7xl mx-auto">
        {markets
          .filter(
            (mrkt) =>
              marketCategory.includes(
                mrkt.marketCategory as MarketCategoryEnum
              ) && marketStatus.includes(mrkt.currentStatus as MarketStatusEnum)
          )
          .map((filteredData, i) => (
            <Card key={i} className="h-[370px]">
              <CardHeader className="gap-2">
                <div>
                  <Link to={`/market/${filteredData.marketId}`}>
                    <Image
                      src={filteredData.thumbnailImage}
                      alt="market thumbnail"
                      className="w-24 h-24 object-contain"
                    />
                  </Link>
                </div>
                <div>
                  <Link to={`/market/${filteredData.marketId}`}>
                    <h3 className="font-semibold text-lg">{filteredData.marketTitle}</h3>
                  </Link>
                  <div className="space-x-1">
                    <Chip
                      size="sm"
                      variant="dot"
                      color={
                        filteredData.currentStatus === "open"
                          ? "success"
                          : "default"
                      }
                    >
                      Status:{" "}
                      <span className="capitalize">
                        {filteredData.currentStatus}
                      </span>
                    </Chip>
                    <Chip size="sm" variant="bordered">
                      Category:{" "}
                      <span className="capitalize">
                        {filteredData.marketCategory}
                      </span>
                    </Chip>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="overflow-y-auto scrollbar-hide">
                <Table aria-label="outcome tables">
                  <TableHeader>
                    <TableColumn>
                      Outcomes ({filteredData.outcomesAndPrices.length})
                    </TableColumn>
                    <TableColumn>Prices</TableColumn>
                    <TableColumn>Action</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredData.outcomesAndPrices.map((prices, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <span className="capitalize">{prices.outcome}</span>
                        </TableCell>
                        <TableCell>{Number(prices.price).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="flat" color="success">
                            Buy
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>

              <CardFooter className="flex justify-between">
                <Chip color="primary" variant="faded">Volume: 123456</Chip>
                <Link to={`/market/${filteredData.marketId}`}>
                  <span className="text-primary underline-offset-2 underline font-semibold flex">
                    Details <ArrowUpRight />
                  </span>
                </Link>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
