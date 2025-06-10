import { z } from "zod";

export const registerUserSchema = z.object({
    name: z.string().min(3),
    email: z.string().min(6),
    password: z.string().min(6)
})