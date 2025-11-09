import { redis } from "../redisClient";

interface PortfolioUpdateData {
    orderId: string,
    newOrderQty: number,
    newAvgPrice: number
}

async function portFolioUpdate({ portfolioUpdateData }: { portfolioUpdateData: PortfolioUpdateData }) {
    const streamKey = "portfolio:update";
    const data = portfolioUpdateData;
    await redis.xadd(streamKey, "*", "portfolioUpdate", JSON.stringify(data))
}

export { portFolioUpdate, type PortfolioUpdateData}