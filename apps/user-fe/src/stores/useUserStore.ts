import { create } from "zustand";
import { persist } from "zustand/middleware";


interface UserStore {
    isError: boolean
    
    fetchPositions : () => Promise<void>
}

const useuserStore = create(persist<UserStore>((set) => ({

    isError: false,

    fetchPositions: async () => {
        set({isError: false})
        try {
            const sendReq = await fetch("http://localhost:8000/api/v0/user/positions", {credentials: "include", method: "GET"})

            const res = await sendReq.json()

            console.log(res);
            
        } catch (error) {
            console.log(error);
        }
    }

}), {name: "user-store"}))

export {useuserStore}