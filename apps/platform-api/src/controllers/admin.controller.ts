import { Request } from "express";
import {RegisterSchema, LoginShema, MarketSchema} from "shared/dist/index"
import { db } from "../db/dbConnection";
import { adminsTable, marketTable } from "../db/schema";
import { eq } from "drizzle-orm";
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
        const jwtToken = jwt.sign({adminId: findAdmin[0].adminId, role: findAdmin[0].role},`${process.env.ADMIN_JWT_SECRET_KEY}`)

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
    // @ts-ignore
    const role = req.role
    
    const validateAdminInput = MarketSchema.safeParse(data);

    if (!validateAdminInput.success) {
        return res.status(400).json({})
    }

    try {
        const createMarket = await db.insert(marketTable).values({
            marketId: uuidv4(),
            marketTitle: data.title,
            side1: data.side1,
            side2: data.side2,
            marketStarts: data.marketStarts,
            marketEnds: data.marketEnds,
            marketCreatedBy: ""
        }).returning()

        return res.status(200).json({success: true, message: `Market ${createMarket[0].marketTitle} created successfully`})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error"})
    }
}


export { adminRegister, adminLogin, createMarket }