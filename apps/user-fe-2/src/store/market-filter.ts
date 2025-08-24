import { create } from "zustand";
import { persist } from "zustand/middleware";


export type MarketCategoryEnum = "sports" | "politics" | "crypto" | "regular" | "all"
export type MarketStatusEnum = "open" | "not_started" | "cancelled" | "settled"

interface MarketFilter {
    marketCategory: MarketCategoryEnum[]
    marketStatus: MarketStatusEnum[]

    changeMarketCategory: ({ catgry }: { catgry: MarketCategoryEnum }) => void;
    changeMarketStatus: ({ status }: { status: MarketStatusEnum }) => void;
}

const marketFilter = create(persist<MarketFilter>((set) => ({
    marketCategory: ["all"],
    marketStatus: ["open"],


    changeMarketCategory: ({ catgry }) => {
        set((prev) => ({
            marketCategory: prev.marketCategory.includes(catgry) ? prev.marketCategory.filter((category) => category !== catgry) : [...prev.marketCategory, catgry]
        }))
    },

    changeMarketStatus: ({ status }) => {
        set((prev) => ({
            marketStatus: prev.marketStatus.includes(status) ? prev.marketStatus.filter((stus) => stus !== status) : [...prev.marketStatus, status]
        }))
    }
}), { name: "market-filters" }))


export { marketFilter }