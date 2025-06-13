import { Router } from "express";
import { adminLogin, adminRegister } from "../controllers/admin.controller";

const router  = Router()

router.post("/auth/register", adminRegister)
router.post("/auth/login", adminLogin)
export default router