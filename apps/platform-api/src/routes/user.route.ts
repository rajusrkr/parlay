import { Router } from "express";
import { addMoney, userLogin, userRegister } from "../controllers/user.controller";
import { userJwt } from "../middlewares/user.middleware";
import { handleOrder } from "../controllers/order.controller";

const router  = Router()

router.post("/auth/register", userRegister)
router.post("/auth/login", userLogin)
router.post("/handle-order", userJwt, handleOrder)
router.post("/add-money", userJwt, addMoney)

export default router