import z from "zod"

export const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().min(6),
    password: z.string().min(6)
})
