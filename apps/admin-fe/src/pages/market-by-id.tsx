import { useParams } from "react-router";
import { useMarketStore } from "../store/market";
import { Card, CardBody, Chip, Image, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import MarketSettings from "../components/market-settings";

export default function MarketById() {
    const { markets } = useMarketStore();
    const marketId = useParams().id

    const marketData = markets.filter((mrkts) => mrkts.marketId === marketId)[0];

    const { marketTitle, thumbnailImage, marketSettlement, marketOverview, outcomesAndPrices, marketEnds, marketCategory, marketStarts, currentStatus } = marketData

    return (
        <div className="px-10 mt-4 space-y-4 max-w-6xl mx-auto">
            {/* Show image and title */}
            <div className="flex items-center gap-2">
                <Image
                    src={thumbnailImage}
                    height={80}
                    width={80}
                    className="h-80 w-80 rounded-full object-cover"
                />
                <p className="text-4xl capitalize">{marketTitle}</p>
                <Chip color="secondary" variant="flat" size="lg"><span className="capitalize font-semibold">{marketCategory}</span></Chip>
            </div>
            {/* Show starting date and Ending date */}

            <div>
                <div className="space-x-3 flex items-center">
                    <Chip color="secondary" variant="flat"><span className="capitalize font-semibold">{currentStatus !== "not_started" ? (<>{`Status: ${currentStatus}`}</>) : (<>{"Status: Not started"}</>)}</span></Chip>
                    {/* Only show stating date for not started markets */}
                    {
                        currentStatus === "not_started" && (<Chip color="success" variant="flat">
                            <span>{`Starting date: ${new Date(marketStarts * 1000).toLocaleString()}`}</span>
                        </Chip>)
                    }
                    <Chip color="warning" variant="flat">
                        <span>{`Ending date: ${new Date(marketEnds * 1000).toLocaleString()}`}</span>
                    </Chip>

                    {/* Show market settings change except settled and cacelled */}

                    {
                        currentStatus !== "settled" && currentStatus !== "cancelled" && (<MarketSettings marketData={marketData} />)
                    }
                </div>
            </div>

            {/* Show outcomes and Price*/}
            <div>
                <h3 className="text-xl font-semibold">Outcomes</h3>
                <Table aria-label="Outcome and prices table" className="max-w-lg">
                    <TableHeader>
                        <TableColumn>Outcome</TableColumn>
                        <TableColumn>Price</TableColumn>
                        <TableColumn>Open Qty</TableColumn>
                    </TableHeader>

                    <TableBody>
                        {
                            outcomesAndPrices.map((otcmsAndPrice) => (
                                <TableRow key={otcmsAndPrice.outcome}>
                                    <TableCell><span className="capitalize">{otcmsAndPrice.outcome}</span></TableCell>
                                    <TableCell><span className="capitalize">{otcmsAndPrice.price}</span></TableCell>
                                    <TableCell><span className="capitalize">{otcmsAndPrice.tradedQty}</span></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>

            {/* Show Settlement and overview card */}
            <div>
                <h3 className="text-xl font-semibold">Settlement and Overview</h3>

                <Card className="max-w-lg">
                    <CardBody className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-black">Overview</h3>
                            <p className="ml-4 font-semibold text-black/60">{marketOverview}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-black">Settlement</h3>
                            <p className="ml-4 font-semibold text-black/60">{marketSettlement}</p>
                        </div>
                    </CardBody>

                </Card>
            </div>
        </div>
    )
}
