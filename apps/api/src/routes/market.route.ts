import { Router } from "express";
import {
  getAllMarket,
  getMarketById,
} from "../controllers/market.controller";

const router = Router();

router.get("/get-markets", getAllMarket);
router.get("/get-market-byId", getMarketById)

export default router;
