import { Request } from "express";
import {RegisterSchema, LoginShema, MarketSchema} from "shared/dist/index"
import { db } from "../db/dbConnection";
import { adminsTable, marketTable, priceData } from "../db/schema";
import { and, eq } from "drizzle-orm";
import bcrypt from "bcrypt"
import {v4 as uuidv4} from "uuid"
import jwt from "jsonwebtoken"

const adminRegister = async (req: Request, res: any) => {
    const data = req.body;
    const validateAdminInput = RegisterSchema.safeParse(data)

    if (!validateAdminInput.success) {
        return res.status(400).json(validateAdminInput.error)
    }

    try {
        const isAdminExists = await db.select().from(adminsTable).where(eq(adminsTable.email, data.email))

        if (isAdminExists.length !== 0) {
            return res.status(400).json({success: false, message: "User already exists with provided email."})
        }

        const hashedPassword = bcrypt.hashSync(data.password, 10)

        const createAdmin = await db.insert(adminsTable).values({
            adminId: uuidv4(),
            name: data.name,
            email: data.email,
            password: hashedPassword
        }).returning()

        if (createAdmin.length === 0) {
            return res.status(400).json({success: false, message: "db error: unable to create user."})
        }

        return res.status(200).json({success: true, message: "Admin created successfully", userId: createAdmin[0].adminId})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error.", data})
    }

}

const adminLogin = async (req: Request, res: any) => {
    const data = req.body;

    const validateAdminInput = LoginShema.safeParse(data);

    if (!validateAdminInput.success) {
        return res.status(400).json({success: false, message: "Invalid credentials"})
    }

    try {
        const findAdmin = await db.select({adminId: adminsTable.adminId, password: adminsTable.password, role: adminsTable.role}).from(adminsTable).where(eq(adminsTable.email, data.email))

        if (findAdmin.length === 0) {
            return res.status(400).json({success: false, message: "This email is not registered"})
        }

        // compare password
        const dbPassword = findAdmin[0].password

        // compare password
        const compare = bcrypt.compareSync(data.password, dbPassword!)

        if (!compare) {
            return res.status(401).json({success: false, message: "Wrong credentials"})
        }

        // sign jwt
        const jwtToken = jwt.sign({adminId: findAdmin[0].adminId},`${process.env.ADMIN_JWT_SECRET_KEY}`)

        return res.status(200).json({success: true, message: "Login success", token: jwtToken})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }

}

const createMarket = async (req: Request, res: any) => {
    const data = req.body;

    // @ts-ignore
    const adminId = req.adminId
    
    const validateAdminInput = MarketSchema.safeParse(data);

    if (!validateAdminInput.success) {
        return res.status(400).json({success: false, message: "Invalid data received from admin", error: validateAdminInput.error})
    }

    try {
        const createMarket = await db.insert(marketTable).values({
            marketId: uuidv4(),
            marketTitle: data.marketTitle,
            yesSide: data.side1,
            noSide: data.side2,
            marketStarts: new Date(data.marketStarts),
            marketEnds: new Date(data.marketEnds),
            marketCreatedBy: adminId
        }).returning()

        return res.status(200).json({success: true, message: `${createMarket[0].marketTitle} - created successfully`})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}

const deleteMarket = async (req: Request, res: any) => {
    const marketId = req.query.marketId
    
    // @ts-ignore
    const adminId = req.adminId

    try {
        const deleteMarketById = await db.delete(marketTable).where(
            and(
                eq(marketTable.marketId, marketId!.toString()),
                eq(marketTable.marketCreatedBy, adminId)
            )
        ).returning()

        if (deleteMarketById.length === 0) {
            return res.status(400).json({success: false, message: `Nothing found with this id, ${marketId}`})
        }

        return res.status(200).json({success: true, message: `Delete success for ${marketId}`})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}

const editMarketStatus = async (req: Request, res: any) => {
    const data = req.query.status;
    const marketId = req.query.marketId;
    // @ts-ignore
    const adminId = req.adminId;

    const allowedInputs = ["NOT_STARTED", "OPEN", "SETTLED", "CANCELLED"] as const;

    const status = allowedInputs.find((s) => s === data!.toString().toUpperCase())


    if (!status || typeof status === "undefined") {
        return res.status(400).json({success: false, message: "Invalid status code"})
    }

    try {
        const updateMarket = await db.update(marketTable).set({
            currentStatus: status
        }).where(and(
            eq(marketTable.marketId, marketId!.toString()),
            eq(marketTable.marketCreatedBy, adminId)
        )).returning()

        if (updateMarket.length === 0) {
            return res.status(200).json({success: false, message: "Unable change the status"})
        }

        if (updateMarket[0].currentStatus === "OPEN") {
            await db.insert(priceData).values({
                marketId: marketId!.toString(),
                noSidePrice: 50,
                yesSidePrice: 50
            })

            return res.status(200).json({success: true, message: "Market status changed to OPEN and price data created"})
        }

        return res.status(200).json({success: true, message: "Update success", current_status: updateMarket[0].currentStatus})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}


export { adminRegister, adminLogin, createMarket, deleteMarket, editMarketStatus }