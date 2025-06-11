import { Router } from "express";
import { userRegister } from "../controllers/user.controller";

const router  = Router()

router.post("/auth/register", userRegister)

export default router