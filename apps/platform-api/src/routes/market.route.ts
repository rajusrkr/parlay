import { Router } from "express";
import { getAllMarket, getPrices } from "../controllers/market.controller";

const router = Router()

router.get("/get-markets", getAllMarket)
router.post("/get-price", getPrices)

export default router