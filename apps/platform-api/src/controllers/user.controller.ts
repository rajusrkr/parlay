import { Request } from "express";
import {RegisterSchema} from "shared/dist/index"
import { db } from "../db/dbConnection";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt"
import {v4 as uuidv4} from "uuid"

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


export { userRegister }