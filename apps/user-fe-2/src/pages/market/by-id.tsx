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
import { useEffect, useState } from "react";
import { PLATFORM_API_URI } from "../../constants/index";

interface SelectedOutcome {
  outcome: string;
  price: string;
}

interface OrderData {
  qty: number;
  orderType: string;
  votedOutcome: string;
  marketId: string;
}

export default function MarketById() {
  const { markets } = usemarketStore();
  const marketIdFromUrl = useParams().id;

  const {
    marketTitle,
    currentStatus,
    marketCategory,
    outcomesAndPrices,
    marketOverview,
    marketSettlement,
    thumbnailImage,
  } = markets.filter((mrkt) => mrkt.marketId === marketIdFromUrl)[0];

  const [selectedOutcome, setSelectedOutcom] = useState<SelectedOutcome>({
    outcome: outcomesAndPrices[0].outcome,
    price: outcomesAndPrices[0].price,
  });
  const [qty, setQty] = useState<number | null>(null);

  const [cost, setCost] = useState<Number>(0);

  useEffect(() => {
    const newCost = Number(qty) * Number(selectedOutcome.price);
    setCost(Number(newCost.toFixed(2)));
  }, [qty, selectedOutcome.price]);

  const handleOrder = async () => {
    const validatedData: OrderData = {
      marketId: marketIdFromUrl!,
      orderType: "buy",
      qty: qty!,
      votedOutcome: selectedOutcome.outcome,
    };

    try {
      const sendReq = await fetch(`${PLATFORM_API_URI}/user/handle-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
        credentials: "include",
      });

      const res = await sendReq.json();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

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
                    className="w-28 h-28 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{marketTitle}</h3>
                  <div className="space-x-1">
                    <Chip
                      size="md"
                      variant="dot"
                      color={currentStatus === "open" ? "success" : "default"}
                    >
                      Status:{" "}
                      <span className="capitalize">{currentStatus}</span>
                    </Chip>
                    <Chip size="md" variant="bordered">
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
                <TableColumn className="text-lg">
                  Outcomes ({outcomesAndPrices.length})
                </TableColumn>
                <TableColumn className="text-lg">Chances</TableColumn>
                <TableColumn className="text-lg">Prices</TableColumn>
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
                    <TableCell>{`${(Number(prices.price) * 100).toFixed(2)} %`}</TableCell>
                    <TableCell>{`$ ${Number(prices.price).toFixed(2)}/Share`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Overview and settlement */}
          <div>
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Overview & Settlement</h3>
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
          <Card className="max-w-4xl py-1.5">
            <CardHeader className="">
              <p className="font-semibold text-lg text-default-500">
                Place Order
              </p>
            </CardHeader>
            <CardBody>
              <div className="flex justify-between">
                <div>
                  <p className="capitalize font-semibold ">
                    ✅{" You have selected: "}
                    <span className="underline underline-offset-2 text-primary-500">
                      {selectedOutcome.outcome}
                    </span>
                  </p>
                </div>

                <div>
                  <Chip
                    variant="faded"
                    color="primary"
                  >{`Price: ${Number(selectedOutcome.price).toFixed(2)}`}</Chip>
                </div>
              </div>

              <div className="mt-4 flex justify-between gap-2">
                <div className="space-y-1.5">
                  <div>
                    <Chip variant="faded" color="success">
                      Order Quantity
                    </Chip>
                  </div>
                  <div>
                    <Input
                      className="w-96"
                      variant="faded"
                      placeholder="Quantity, eg: 5000"
                      onChange={(e) => {
                        setQty(Number(e.target.value));
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <Chip variant="faded" color="success">
                      Total cost
                    </Chip>
                  </div>
                  <div>
                    <Input
                      variant="faded"
                      disabled
                      placeholder="000"
                      value={cost?.toString()}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Chip color="danger" variant="flat">
                  Attention: Orders can get executed upto between 10% - 15%
                  slippage.
                </Chip>
              </div>
            </CardBody>
            <CardFooter>
              <Button
                variant="flat"
                color="success"
                className="w-full"
                onPress={handleOrder}
              >
                Buy
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
