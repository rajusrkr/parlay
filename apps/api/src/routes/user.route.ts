import { Router } from "express";
import { addMoney, getAllPositions, placeBet, userLogin, userRegister } from "../controllers/user.controller";
import { userJwt } from "../middlewares/user.middleware";

const router  = Router()

router.post("/auth/register", userRegister)
router.post("/auth/login", userLogin)
router.post("/add-money", userJwt, addMoney)
router.get("/positions", userJwt, getAllPositions)
router.post("/bet", userJwt, placeBet)

export default router