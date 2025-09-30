import { z } from "zod";

export const LoginShema = z.object({
    email: z.email(),
    password: z.string().min(6)
})