import { Router } from "express";
import { adminLogin, adminRegister, createMarket, deleteMarket, deleteUser, editMarketStatus } from "../controllers/admin.controller";
import { adminJwt } from "../middlewares/admin.middleware";

const router  = Router()

router.post("/auth/register", adminRegister)
router.post("/auth/login", adminLogin)
router.post("/create-market", adminJwt, createMarket)
router.delete("/delete-market", adminJwt, deleteMarket)
router.put("/edit-market-status",adminJwt, editMarketStatus)
router.delete("/delete-user", adminJwt, deleteUser)
export default router