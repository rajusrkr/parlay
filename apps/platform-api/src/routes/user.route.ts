import { Router } from "express";
import { placeOrder, userLogin, userRegister, verifyUserBeforeOrderPlacement } from "../controllers/user.controller";
import { userJwt } from "../middlewares/user.middleware";

const router  = Router()

router.post("/auth/register", userRegister)
router.post("/auth/login", userLogin)
router.post("/create-order", userJwt, placeOrder)
router.post("/pre-order", userJwt, verifyUserBeforeOrderPlacement)

export default router