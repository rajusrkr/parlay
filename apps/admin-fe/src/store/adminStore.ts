// import z from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginSchema } from "@repo/shared/src"

export const BACKEND_URI = import.meta.env.VITE_API_SERVER_URL;


interface States {
    isLoading: boolean,
    isError: boolean,
    errorMessage: string | null,

    login: ({ email, password, navigate }: { email: string, password: string, navigate: (pasth: string) => void }) => Promise<void>
}

const useAdminStore = create(persist<States>((set) => ({
    isLoading: false,
    isError: false,
    errorMessage: null,

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
    }
}), { name: "admin-store" }))

export { useAdminStore }