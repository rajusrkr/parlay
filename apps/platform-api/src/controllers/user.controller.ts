import { Request } from "express";
import { RegisterSchema, LoginShema } from "shared/dist/index"
import { db } from "../db/dbConnection";
import { marketTable, orderTable, usersTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
// import { sendToWsServer, ws } from "../ws-client";
import {wsSend} from "shared/dist/index"
import { sendOrderToWsServer } from "../ws/send-order";


const userRegister = async (req: Request, res: any) => {
    const data = req.body;
    const validateUserInput = RegisterSchema.safeParse(data)

    if (!validateUserInput.success) {
        return res.status(400).json(validateUserInput.error)
    }

    try {
        const isUserExists = await db.select().from(usersTable).where(eq(usersTable.email, data.email))

        if (isUserExists.length !== 0) {
            return res.status(400).json({success: false, message: "User already exists with provided email."})
        }

        const hashedPassword = bcrypt.hashSync(data.password, 10)

        const createUser = await db.insert(usersTable).values({
            userId: uuidv4(),
            name: data.name,
            email: data.email,
            password: hashedPassword
        }).returning()

        if (createUser.length === 0) {
            return res.status(400).json({success: false, message: "db error: unable to create user."})
        }

        return res.status(200).json({success: true, message: "User created successfully", userId: createUser[0].userId})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error.", data})
    }

}

const userLogin = async (req: Request, res: any) => {
    const data = req.body;

    const validateUserData = LoginShema.safeParse(data)

    if (!validateUserData.success) {
        return res.status(400).json({success: false, message: "Data is not valid"})
    }

    try {
        const findUser = await db.select({email:usersTable.email, password: usersTable.password, userId: usersTable.userId}).from(usersTable).where(eq(usersTable.email, data.email))

        if (findUser.length === 0) {
            return res.status(400).json({success: false, message: "Nothing found with provided email"})
        }

        // get db password
        const dbPassword = findUser[0].password;

        // compare password
        const compare = bcrypt.compareSync(data.password, dbPassword!)

        if (!compare) {
            return res.status(400).json({success: false, message: "Wrong credentials"})
        }

        // sign jwt
        const signJWT = jwt.sign({userId: findUser[0].userId}, `${process.env.JWT_SECRET}`)

        return res.status(200).json({success: true, message: "Login success", jwt_token: signJWT})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message: "Internal server error"})
    }
}

const verifyUserAndOrderPlacement = async (req: Request, res: any) => {
    const data = req.body;
    // BODY WILL CONTAIN
    // - order_side
    // - order_qty
    // - userId
    // - marketId

    // here i will do user verification and data checks
    // after that i will forward details to price-engine

    //@ts-ignore
    const userId = req.userId



    // this below three can be check via zod, will implement this later
    if (typeof data.orderQty !== "number") {
        return res.status(400).json({success: false, message: "Quantity is invalid"})
    }

    if (typeof userId !== "string") {
        return res.status(400).json({success: false, message: "User Id is invalid"})
    }

    if (typeof data.marketId !== "string") {
        return res.status(400).json({success: false, message: "Market Id is invalid"})
    }

    try {
        const marketDetailsFromMarketId = await db.select().from(marketTable).where(eq(marketTable.marketId, data.marketId))

        if (marketDetailsFromMarketId[0].currentStatus !== "OPEN" || marketDetailsFromMarketId.length === 0) {
            return res.status(400).json({success: false, message: "This market is not tradeable right now"})
        };

        // send data to price-engine
        try {
            const response = await sendOrderToWsServer({sentEvent: "new-order", data: {
                orderSide: data.orderSide,
                orderType: data.orderType,
                userOrderQty: data.orderQty,
                prevYesSideQty: marketDetailsFromMarketId[0].totalYesQty,
                prevNoSideQty: marketDetailsFromMarketId[0].totalNoQty,
                marketId: data.marketId,
                userId: userId
            }})

            console.log("response", response);
            

            return res.status(200).json({response})
            
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log( new Date().toLocaleTimeString("en-IN", {timeZone: "Asia/Kolkata"}), error);
        return res.status(500).json({success: false, message: "Internal server error"})   
    }
}


export { userRegister, userLogin, verifyUserAndOrderPlacement }