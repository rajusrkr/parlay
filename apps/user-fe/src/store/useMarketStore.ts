import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type MarketTypeInterface } from "@repo/shared/src"
import { BACKEND_URI } from "../lib/utils";


interface Market {
    isLoading: boolean;
    isError: boolean;
    errorMessage: string | null;

    markets: MarketTypeInterface[];

    fetchMarkets: () => Promise<void>;
    updatePrices: ({ marketId, newPriceData }: { marketId: string, newPriceData: any }) => void;
}

const useMarketStore = create(persist<Market>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: null,
    markets: [],

    fetchMarkets: async () => {
        set({ isError: false, errorMessage: null, isLoading: true })
        try {
            const sendReq = await fetch(`${BACKEND_URI}/api/v0/market/get-markets`)

            const res = await sendReq.json()

            if (res.success) {
                set({ isLoading: false, markets: res.markets })
            } else {
                set({ isLoading: false, isError: true, errorMessage: res.message })

            }
        } catch (error) {
            console.log(error);
            set({ isLoading: false, isError: true, errorMessage: "Uncaught error" })
        }
    },

    updatePrices: ({ marketId, newPriceData }) => {
        set((prev) => ({
            markets: prev.markets.map((market) => market.marketId === marketId ? { ...market, outcomesAndPrices: newPriceData } : market)
        }))
    }

}), { name: "market" }))


export { useMarketStore }