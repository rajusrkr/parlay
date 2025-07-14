import { Router } from "express";
import { adminLogin, adminRegister, createMarket, deleteMarket, editMarketStatus } from "../controllers/admin.controller";
import { adminJwt } from "../middlewares/admin.middleware";

const router  = Router()

router.post("/auth/register", adminRegister)
router.post("/auth/login", adminLogin)
router.post("/create-market", adminJwt, createMarket)
router.delete("/delete-market", adminJwt, deleteMarket)
router.put("/edit-market-status",adminJwt, editMarketStatus)

export default router