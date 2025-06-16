import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken"

function userJwt(req: Request, res: any, next: NextFunction){
    const token = req.headers["authorization"] ?? "";

    if (!token) {
        return res.status(400).json({success: false, message: "No auth token available, login again"})
    }

    try {
        const decode = jwt.verify(token, `${process.env.JWT_SECRET}`)
        //@ts-ignore
        const userId = decode.userId;
        //@ts-ignore
        req.userId = userId

        return next()
    } catch (error: any) {
        return res.status(400).json({success: false, message: error.message})
    }
}

export { userJwt }