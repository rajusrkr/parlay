import { Router } from "express";
import { createMarket } from "../controllers/admin.controller";

const router = Router()


router.post("/create-market", createMarket)

export default router