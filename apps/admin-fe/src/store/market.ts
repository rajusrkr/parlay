import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OutcomeAndPrice {
    price: string,
    outcome: string,
    tradedQty: number
}

interface MarketData {
    market_id: string,
    market_title: string,
    market_overview: string,
    market_settlement: string,
    current_status: string,
    market_category: string,
    market_thumbnail_image_url: string,
    market_starts: number,
    market_ends: number,
    winner: string,
    outcome_and_price: OutcomeAndPrice[]
}


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
    }
}), { name: "market" }))


export { useMarketStore }