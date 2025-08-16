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

export default function MarketCards({marketStatus} : {marketStatus: string}) {
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
              .map((opnMrkt, i) => (
                <Card className="mt-4" key={i}>
                  {/* Card header */}
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Image
                        src={opnMrkt.thumbnailImage}
                        height={30}
                        width={30}
                        alt="Market Thumnail Image"
                      />
                      <p className="text-2xl">{opnMrkt.marketTitle}</p>
                    </div>
                  </CardHeader>
                  {/* Card body */}
                  <CardBody className="h-20">
                    <div>
                      <h3>Outcomes ({opnMrkt.outcomesAndPrices.length}):</h3>
                      {opnMrkt.outcomesAndPrices.map((outcmsPrices, i) => (
                        <p
                          key={i}
                          className="capitalize"
                        >{`${i + 1}. ${outcmsPrices.outcome}`}</p>
                      ))}
                    </div>
                  </CardBody>

                  {/* Card footer */}
                  <CardFooter>
                    <div>
                      <Chip size="sm">
                        Closing:
                        {` ${new Date(opnMrkt.marketEnds * 1000).toLocaleString()}`}
                      </Chip>
                    </div>
                    <div>
                      <Link to={"/"}>Details</Link>
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

/**
 *
 * array.length > 0 show card
 * array.length === 0 show loader, after loading finishes, if have items show it else show nothing to show
 *
 *
 *
 *
 * nothing
 * loading
 */
