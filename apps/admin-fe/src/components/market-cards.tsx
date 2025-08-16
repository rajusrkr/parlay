import { useEffect } from "react";
import { useMarketStore } from "../store/market";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Spinner,
} from "@heroui/react";
import { Link } from "react-router";
import { ChevronRightCircle } from "lucide-react";

export default function MarketCards({
  marketStatus,
}: {
  marketStatus: string;
}) {
  const { fetchMarkets, markets, isLoading } = useMarketStore();

  useEffect(() => {
    (async () => {
      await fetchMarkets();
    })();
  }, []);

  return (
    <div className="px-10">
      <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
        {/* Array length 0 and loading */}
        {markets.filter((mrkt) => mrkt.currentStatus === marketStatus)
          .length === 0 &&
          isLoading && (
            <div>
              <Spinner />
            </div>
          )}

        {/* Not loading and array length 0 */}
        {markets.filter((mrkt) => mrkt.currentStatus === marketStatus)
          .length === 0 &&
          !isLoading && (
            <div>
              <p>There is nothing to show here</p>
            </div>
          )}

        {/* Array is not empty */}
        {markets.filter((mrkt) => mrkt.currentStatus === marketStatus).length >
          0 && (
          <>
            {markets
              .filter((mrkt) => mrkt.currentStatus === marketStatus)
              .map((filteredMrkts, i) => (
                <Card className="mt-4" key={i}>
                  {/* Card header */}
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Image
                        src={filteredMrkts.thumbnailImage}
                        height={50}
                        width={50}
                        alt="Market Thumnail Image"
                        className="w-50 h-50 object-cover rounded-full"
                      />
                      <p className="text-2xl capitalize">
                        {filteredMrkts.marketTitle}
                      </p>
                      <Chip color="secondary" size="sm" variant="flat">
                        <span className="capitalize font-semibold">
                          {filteredMrkts.marketCategory}
                        </span>
                      </Chip>
                    </div>
                  </CardHeader>
                  {/* Card body */}
                  <CardBody className="h-24">
                    <div>
                      <h3>
                        Outcomes ({filteredMrkts.outcomesAndPrices.length}):
                      </h3>
                      {filteredMrkts.outcomesAndPrices.map(
                        (outcmsPrices, i) => (
                          <p
                            key={i}
                            className="capitalize"
                          >{`${i + 1}. ${outcmsPrices.outcome}`}</p>
                        )
                      )}
                    </div>
                  </CardBody>

                  {/* Card footer */}
                  <CardFooter className="flex justify-between">
                    <div>
                      <Chip size="sm" color="warning" variant="flat">
                        <span className="font-semibold">
                          Closing:
                          {` ${new Date(filteredMrkts.marketEnds * 1000).toLocaleString()}`}
                        </span>
                      </Chip>
                    </div>
                    <div>
                      <Link
                        to={"/"}
                        className="underline text-primary flex items-center gap-0.5"
                      >
                        Details <ChevronRightCircle size={"18"} />
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
