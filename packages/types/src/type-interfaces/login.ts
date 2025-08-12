import { z } from "zod";

export const LoginShema = z.object({
    email: z.string().min(6),
    password: z.string().min(6)
})