import z from "zod"

export const RegisterSchema = z.object({
    name: z.string().min(4),
    email: z.email(),
    password: z.string().min(6)
})
