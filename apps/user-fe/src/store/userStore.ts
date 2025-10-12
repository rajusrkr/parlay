import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BACKEND_URI } from "../lib/utils";
import type { MarketByIdInterface, MarketsInterface } from "@repo/shared/src";

interface States {
    isLoading: boolean,
    isError: boolean,
    isMarketFetching: boolean,
    errorMessage: null | string

    markets: MarketsInterface[]
    marketById: MarketByIdInterface | undefined,

    login: ({ email, password }: { email: string, password: string, navigate: (path: string) => void }) => Promise<void>
    fetchMarketById: ({ marketId }: { marketId: string }) => Promise<void>
    fetchAllMarkets: () => Promise<void>;
}

const useUserStore = create(persist<States>((set) => ({
    isLoading: false,
    isError: false,
    isMarketFetching: false,
    errorMessage: null,
    markets: [],
    marketById: undefined,

    login: async ({ email, password, navigate }) => {
        try {
            set({ isLoading: true, isError: false, errorMessage: null })
            const sendReq = await fetch(`${BACKEND_URI}/api/v0/user/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            })

            const res = await sendReq.json()
            console.log(res);

            if (res.success) {
                set({ isLoading: false })
                navigate("/market")
            } else {
                set({ isError: true, errorMessage: res.message, isLoading: false })
            }
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllMarkets: async () => {
        try {
            set({ isLoading: true, isError: false, errorMessage: null })
            const sendReq = await fetch(`${BACKEND_URI}/market/get-markets`);

            const res = await sendReq.json()

            if (res.success) {
                set({ isLoading: false, markets: res.markets })
            } else {
                set({ isLoading: false, isError: true, errorMessage: res.message })
            }
        } catch (error) {
            console.log(error);
        }
    },

    fetchMarketById: async ({ marketId }) => {
        try {
            set({ isMarketFetching: true })
            const sendReq = await fetch(`${BACKEND_URI}/market/get-market-byId?marketId=${marketId}`)
            const res = await sendReq.json()

            if (res.success) {
                set({ marketById: res.market[0], isMarketFetching: false })

            } else {
                console.log(res);
                set({ isMarketFetching: false })
            }

        } catch (error) {
            console.log(error);
        }
    },
}), { name: "user-store" }))

export { useUserStore }