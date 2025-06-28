import { Router } from "express";
import { userLogin, userRegister } from "../controllers/user.controller";
import { userJwt } from "../middlewares/user.middleware";
import { handleOrder } from "../controllers/order.controller";

const router  = Router()

router.post("/auth/register", userRegister)
router.post("/auth/login", userLogin)
router.post("/handle-order", userJwt, handleOrder)

export default router