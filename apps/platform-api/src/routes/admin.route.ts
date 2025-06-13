import { Router } from "express";
import { adminRegister } from "../controllers/admin.controller";

const router  = Router()

router.post("/auth/register", adminRegister)
export default router