import { z } from "zod";

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
})