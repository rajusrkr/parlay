import {Router} from "express"
import { userRegistration } from "../controllers/user.controller";

const router = Router()

router.post("/auth/register", userRegistration)

export default router;