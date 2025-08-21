import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MarketData } from "types/src/index"



interface Market {
    // Error handle
    isError: boolean,
    erroeMessage: string | null,

    // Loading
    isLoading: boolean

    // Data
    markets: MarketData[]

    // API calls
    fetchMarkets: () => Promise<void>
    editMarket: () => Promise<void>
}

const BACKEND_URI = import.meta.env.VITE_PLATFORM_API_URI;


const useMarketStore = create(persist<Market>((set) => ({
    isError: false,
    erroeMessage: null,

    isLoading: false,

    markets: [],


    fetchMarkets: async () => {
        set({ isError: false, erroeMessage: null, isLoading: true })
        try {
            const sendReq = await fetch(`${BACKEND_URI}/market/get-markets`)

            const res = await sendReq.json()

            if (res.success) {
                set({ isLoading: false, markets: res.markets })
            } else {
                set({ isError: true, erroeMessage: res.message, isLoading: false })
            }
        } catch (error) {
            console.log(error);
            set({ isLoading: false })
        }
    },

    editMarket: async () => {
        try {
            set((prev) => ({
                ...prev,
                markets: prev.markets.map((market) => market.marketId === "dfjdgy" ? { ...market, } : market)
            }))
        } catch (error) {

        }
    }
}), { name: "market" }))


export { useMarketStore }