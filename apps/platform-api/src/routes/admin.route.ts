import { Router } from "express";
import { adminLogin, adminRegister, createMarket } from "../controllers/admin.controller";
import { adminJwt } from "../middlewares/admin.middleware";

const router  = Router()

router.post("/auth/register", adminRegister)
router.post("/auth/login", adminLogin)
router.post("/create-market", adminJwt, createMarket)
export default router