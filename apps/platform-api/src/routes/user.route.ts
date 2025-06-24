import { Router } from "express";
import { userLogin, userRegister, verifyUserAndOrderPlacement } from "../controllers/user.controller";
import { userJwt } from "../middlewares/user.middleware";

const router  = Router()

router.post("/auth/register", userRegister)
router.post("/auth/login", userLogin)
router.post("/handle-order", userJwt, verifyUserAndOrderPlacement)

export default router