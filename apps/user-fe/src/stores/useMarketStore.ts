import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Market {
    marketId: string,
    marketTitle: string,
    marketStarts: string,
    marketEnds: string,
    currentStatus: string,
    winnerSide: string | null,
    priceData: {
        yesSide: string | null,
        noSide: string | null
    }
}

interface MarketStates {
    isError: boolean,
    erroMessage: string | null,

    markets: Market[],

    fetchMarkets: () => Promise<void>
    
}

const useMarketStore = create(persist<MarketStates>((set) => ({
    isError: false,
    erroMessage: null,

    markets: [],

    fetchMarkets: async () => {
        try {
            const sendReq = await fetch("http://localhost:8000/api/v0/market/get-markets")

            const res = await sendReq.json()

            if (res.success) {
                set({markets: res.markets})
            } else {
                set({isError: true, erroMessage: res.message})
            }
        } catch (error) {
            console.log(error);
            set({isError: true, erroMessage: "Client side error"})
        }
    }


}), {name: "market-store"}))

export {useMarketStore}