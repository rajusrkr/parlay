import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Positions {
    avgPrice: string,
    marketId: string,
    side: string,
    totalQty: number
}


interface UserStore {
    isError: boolean
    
    fetchPositions : () => Promise<void>


    positions: Positions[]
}

const useuserStore = create(persist<UserStore>((set) => ({

    isError: false,
    positions: [],

    fetchPositions: async () => {
        set({isError: false})
        try {
            const sendReq = await fetch("http://localhost:8000/api/v0/user/positions", {credentials: "include", method: "GET"})

            const res = await sendReq.json()

            if (res.success) {
                set({positions: res.positions})
            }
            
        } catch (error) {
            console.log(error);
        }
    },

}), {name: "user-store"}))

export { useuserStore }