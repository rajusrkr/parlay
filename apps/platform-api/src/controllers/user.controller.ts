import { Request } from "express";
import { RegisterSchema, LoginShema } from "shared/dist/index";
import { db } from "../db/dbConnection";
import { marketTable, orderTable, usersTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const userRegister = async (req: Request, res: any) => {
  const data = req.body;
  const validateUserInput = RegisterSchema.safeParse(data);

  if (!validateUserInput.success) {
    return res.status(400).json(validateUserInput.error);
  }

  try {
    const isUserExists = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email));

    if (isUserExists.length !== 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with provided email.",
        });
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);

    const createUser = await db
      .insert(usersTable)
      .values({
        userId: uuidv4(),
        name: data.name,
        email: data.email,
        password: hashedPassword,
      })
      .returning();

    if (createUser.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "db error: unable to create user." });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "User created successfully",
        userId: createUser[0].userId,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", data });
  }
};

const userLogin = async (req: Request, res: any) => {
  const data = req.body;

  console.log(data);

  const validateUserData = LoginShema.safeParse(data);

  if (!validateUserData.success) {
    return res
      .status(400)
      .json({ success: false, message: "Data is not valid" });
  }

  try {
    const findUser = await db
      .select({
        email: usersTable.email,
        password: usersTable.password,
        userId: usersTable.userId,
      })
      .from(usersTable)
      .where(eq(usersTable.email, data.email));

    if (findUser.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing found with provided email" });
    }

    // get db password
    const dbPassword = findUser[0].password;

    // compare password
    const compare = bcrypt.compareSync(data.password, dbPassword!);

    if (!compare) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong credentials" });
    }

    // sign jwt
    const signJWT = jwt.sign(
      { userId: findUser[0].userId },
      `${process.env.JWT_SECRET}`
    );

    return res
      .cookie("auth_session", signJWT, { 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    })
      .status(200)
      .json({ success: true, message: "Signin success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const addMoney = async (req: Request, res: any) => {
  const data = req.body;

  // @ts-ignore
  const userId = req.userId;

  try {
    const deposit = await db
      .update(usersTable)
      .set({
        userWalletBalance: data.amount.toString(),
      })
      .where(eq(usersTable.userId, userId))
      .returning();

    return res
      .status(200)
      .json({
        success: true,
        message: "Money deposited",
        newBalance: deposit[0].userWalletBalance,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { userRegister, userLogin, addMoney };
