import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BACKEND_URI } from "../lib/utils";


interface States {
    isLoading: boolean,
    isError: boolean,
    errorMessage: null | string

    login: ({ email, password }: { email: string, password: string, navigate: (path: string) => void }) => Promise<void>
}

const useUserStore = create(persist<States>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: null,

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
                set({isLoading: false})
                navigate("/market")
            } else {
                set({isError: true, errorMessage: res.message, isLoading: false})
            }
        } catch (error) {
            console.log(error);
        }
    }
}), { name: "user" }))


export { useUserStore }