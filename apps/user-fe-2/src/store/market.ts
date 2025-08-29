import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type MarketData } from "types/src/index"
import { PLATFORM_API_URI } from "../constants";


interface Market {
    isLoading: boolean;
    isError: boolean;
    errorMessage: string | null;

    markets: MarketData[];

    fetchMarket: () => Promise<void>;
    updatePrices: ({marketId, newPriceData} : {marketId: string, newPriceData: any}) => void;
}

const usemarketStore = create(persist<Market>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: null,

    markets: [],

    fetchMarket: async () => {
        set({ isError: false, errorMessage: null, isLoading: true })
        try {
            const sendReq = await fetch(`${PLATFORM_API_URI}/market/get-markets`)

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

    


    updatePrices: ({marketId,newPriceData}) => {
       set((prev) => ({
        markets: prev.markets.map((market) => market.marketId === marketId ? {...market, outcomesAndPrices: newPriceData} : market)
       }))
    }

}), { name: "market-store" }))


export { usemarketStore }