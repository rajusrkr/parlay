import { Router } from "express";
import { getAllMarket } from "../controllers/market.controller";

const router = Router()

router.get("/get-markets", getAllMarket)

export default router