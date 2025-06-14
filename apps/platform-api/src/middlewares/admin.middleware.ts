import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"


function adminJwt(req: Request, res: any, next: NextFunction){
    const token = req.headers["authorization"] ?? "";
    
    if (!token) {
        return res.status(400).json({success: false, message: "No token received, login again"})
    }

    try {
        const decode = jwt.verify(token, `${process.env.ADMIN_JWT_SECRET_KEY}`)
        // @ts-ignore
        const adminId = decode.adminId;
        // @ts-ignore
        req.adminId = adminId;

        return next()
    } catch (error: any) {
        return res.status(400).json({success: false, message:"Invalid token, login again", error: error.message})
    }
}

export { adminJwt }