interface Outcome {
    title: string;
    price: number;
    totalActiveTradingVolume: number;
}

type marketCategory = "sports" | "politics" | "crypto" | "regular";

interface Market {
    marketId?: string
    title: string
    description: string
    settlement: string
    currentStatus: string
    marketCategory: marketCategory
    marketStarts: number
    marketEnds: number
    outcomes: Outcome[]
    winnerSide?: string
    cryptoDetails?: {
        symbol: string,
        interval: string
    }
}

export {type Outcome, type Market}