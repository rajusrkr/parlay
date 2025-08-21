import { NextFunction, Request, Response, Router } from "express";
import {
  adminLogin,
  adminRegister,
  createMarket,
  deleteMarket,
  editMarket,
  // editMarketStatus,
  fileUpload,
} from "../controllers/admin.controller";
import { adminJwt } from "../middlewares/admin.middleware";
import { upload } from "../middlewares/multer";

const router = Router();

router.post("/auth/register", adminRegister);
router.post("/auth/login", adminLogin);
router.post("/create-market", adminJwt, createMarket);
router.delete("/delete-market", adminJwt, deleteMarket);
// router.put("/edit-market-status", adminJwt, editMarketStatus);


// handle file
function handleFileCheckAndHandleError(
  req: Request,
  res: Response,
  next: NextFunction
) {
  upload.single("file")(req, res, function (error) {
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return next();
  });
}
router.post("/thumbnail-upload", handleFileCheckAndHandleError, fileUpload);
router.patch("/edit-market", adminJwt, editMarket)

export default router;
