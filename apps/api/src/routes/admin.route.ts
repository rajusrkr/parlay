import { Router } from "express";
import {
  addNewMarket,
  adminLogin,
  adminRegister,
  deleteMarket,
  editMarket,
} from "../controllers/admin.controller";
import { adminJwt } from "../middlewares/admin.middleware";

const router = Router();

router.post("/auth/register", adminRegister);
router.post("/auth/login", adminLogin);
router.post("/create-market", adminJwt, addNewMarket);
router.delete("/delete-market", adminJwt, deleteMarket);
router.patch("/edit-market", adminJwt, editMarket)

export default router;
