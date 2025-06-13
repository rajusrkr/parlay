import { Request } from "express";
import {RegisterSchema} from "shared/dist/index"
import { db } from "../db/dbConnection";
import { adminsTable } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt"
import {v4 as uuidv4} from "uuid"

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


export { adminRegister }