import { useParams } from "react-router";
import { usemarketStore } from "../../store/market";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useState } from "react";

interface SelectedOutcome {
  outcome: string;
  price: string;
}

export default function MarketById() {
  const { markets } = usemarketStore();
  const marketIdFromUrl = useParams().id;

  const {
    marketTitle,
    currentStatus,
    marketCategory,
    marketEnds,
    marketStarts,
    outcomesAndPrices,
    marketOverview,
    marketSettlement,
    thumbnailImage,
  } = markets.filter((mrkt) => mrkt.marketId === marketIdFromUrl)[0];

  const [selectedOutcome, setSelectedOutcom] = useState<SelectedOutcome>({
    outcome: outcomesAndPrices[0].outcome,
    price: outcomesAndPrices[0].price,
  });

  return (
    <div className="max-w-7xl mx-auto py-4 px-2">
      <div className="flex gap-8">
        {/* Right side */}
        <div className="w-full space-y-2">
          {/* Title and meta data */}
          <Card>
            <CardBody>
              <div className="flex items-center gap-2">
                <div>
                  <Image
                    src={thumbnailImage}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{marketTitle}</h3>
                  <div className="space-x-1">
                    <Chip
                      size="sm"
                      variant="dot"
                      color={currentStatus === "open" ? "success" : "default"}
                    >
                      Status:{" "}
                      <span className="capitalize">{currentStatus}</span>
                    </Chip>
                    <Chip size="sm" variant="bordered">
                      Category:{" "}
                      <span className="capitalize">{marketCategory}</span>
                    </Chip>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          {/* Outcomes */}
          <div>
            <Table
              aria-label="outcome lists"
              defaultSelectedKeys={["0"]}
              selectionMode="single"
              color="success"
            >
              <TableHeader>
                <TableColumn>Outcome ({outcomesAndPrices.length})</TableColumn>
                <TableColumn>Chances</TableColumn>
                <TableColumn>Prices</TableColumn>
              </TableHeader>

              <TableBody>
                {outcomesAndPrices.map((prices, i) => (
                  <TableRow
                    key={i}
                    onClick={() => {
                      setSelectedOutcom({
                        outcome: prices.outcome,
                        price: prices.price,
                      });
                    }}
                  >
                    <TableCell>
                      <span className="capitalize">{prices.outcome}</span>
                    </TableCell>
                    <TableCell>{Number(prices.price) * 100}</TableCell>
                    <TableCell>{prices.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Overview and settlement */}
          <div>
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Overview & Settlement</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <Chip variant="faded">
                    <span className="font-semibold">Overview</span>
                  </Chip>
                  <p>{marketOverview}</p>
                </div>
                <div>
                  <Chip variant="faded">
                    <span className="font-semibold">Settlements</span>
                  </Chip>
                  <p>{marketSettlement}</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Left side */}
        <div className="w-full">
          <Card className="max-w-4xl">
            <CardHeader className="">
              <p className="font-semibold text-default-500">Place Order</p>
            </CardHeader>
            <CardBody>
              <div className="flex justify-between">
                <div>
                  <p className="capitalize font-semibold ">
                    ✅ <span className="underline underline-offset-2">{selectedOutcome.outcome}</span>
                  </p>
                </div>

                <div>
                  <Chip
                    variant="faded"
                    color="primary"
                  >{`Price: ${selectedOutcome.price}`}</Chip>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div>
                    <Chip variant="faded" color="success">Order Quantity</Chip>
                </div>
                <div>
                    <Input 
                    variant="faded"
                    placeholder="Quantity, eg: 5000"
                    />
                </div>
              </div>

              <div className="mt-4">
                <Chip color="danger" variant="flat">Attention: Orders can get executed upto in between 10% - 15% slippage.</Chip>
              </div>
            </CardBody>
            <CardFooter>
              <Button variant="flat" color="success" className="w-full">
                Buy
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
