// import z from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginSchema, type MarketData } from "@repo/shared/src"

export const BACKEND_URI = import.meta.env.VITE_API_SERVER_URL;


interface States {
    isLoading: boolean,
    isError: boolean,
    errorMessage: string | null,

    markets: MarketData[]
    marketFilter: {
        status: string,
        categories: string[]
    }

    login: ({ email, password, navigate }: { email: string, password: string, navigate: (pasth: string) => void }) => Promise<void>
    fetchAllMarkets: () => Promise<void>;
    setMarketFilters: ({status, categories}:{status: string, categories: string[]}) => void;
}

const useAdminStore = create(persist<States>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: null,
    markets: [],
    marketFilter: {
        status: "open",
        categories: ["sports", "politics", "crypto"]
    },

    login: async ({ email, password, navigate }) => {
        try {
            set({ isLoading: true, isError: false, errorMessage: null })

            const validateData = LoginSchema.safeParse({ email, password })
            const { success, data } = validateData;
            if (!success) {
                set({isLoading: false, isError: true,errorMessage: "Check your inputs"})
                return
            }
            const sendReq = await fetch(`${BACKEND_URI}/admin/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email: data.email, password: data.password })
            })

            const res = await sendReq.json()

            if (res.success) {
                set({ isLoading: false })
                navigate("/admin/console")
            } else {
                set({ isLoading: false, isError: true, errorMessage: res.message })
            }
        } catch (error) {
            console.log(error);
        }
    },

    fetchAllMarkets: async () => {
        try {
            set({isLoading: true, isError: false, errorMessage: null})
            const sendReq = await fetch(`${BACKEND_URI}/market/get-markets`);

            const res = await sendReq.json()

            if (res.success) {
                set({isLoading: false, markets: res.markets})
            } else {
                set({isLoading: false, isError: true, errorMessage: res.message})
            }
        } catch (error) {
            console.log(error);
        }
    },

    setMarketFilters: ({status, categories}) => {
        set({marketFilter: {status, categories}})
    }


}), { name: "admin-store" }))

export { useAdminStore }