import { Request } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { db } from "db/src/dbConnection";
import { position, user } from "db/src/index";
import { eq } from "drizzle-orm";
import { LoginShema, RegisterSchema } from "types/src/index";

const userRegister = async (req: Request, res: any) => {
  const data = req.body;

  const validateData = RegisterSchema.safeParse(data)

  if (!validateData.success) {
    return res.status(400).json({ success: false, message: validateData.error })
  }

  const { email, name, password } = validateData.data;

  try {
    const isUserExists = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (isUserExists.length !== 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists with provided email.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const createUser = await db
      .insert(user)
      .values({
        userId: uuidv4(),
        name: name,
        email: email,
        password: hashedPassword,
      })
      .returning();

    if (createUser.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "db error: unable to create user." });
    }

    return res.status(200).json({
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

  const validateData = LoginShema.safeParse(data);

  if (!validateData.success) {
    return res
      .status(400)
      .json({ success: false, message: validateData.error });
  }


  const { email, password } = validateData.data

  try {
    const findUser = await db
      .select({
        email: user.email,
        password: user.password,
        userId: user.userId,
      })
      .from(user)
      .where(eq(user.email, email));

    if (findUser.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing found with provided email" });
    }

    // get db password
    const dbPassword = findUser[0].password;

    // compare password
    const compare = bcrypt.compareSync(password, dbPassword!);

    if (!compare) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong credentials" });
    }

    // signin jwt
    const signInJWT = jwt.sign(
      { userId: findUser[0].userId },
      `${process.env.JWT_SECRET}`
    );

    // ws auth cookie
    const socketKey = jwt.sign({ role: "userFe" }, `${process.env.JWT_SECRET}`);

    res.cookie("socket-identity", socketKey, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "strict",
    });

    res.cookie("auth_session", signInJWT, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({ success: true, message: "Signin success" });
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
      .update(user)
      .set({
        walletBalance: Math.round((data.amount)).toString(),
      })
      .where(eq(user.userId, userId))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Money deposited",
      newBalance: deposit[0].walletBalance,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getAllPositions = async (req: Request, res: any) => {
  // @ts-ignore
  const userId = req.userId;

  try {
    const positions = await db
      .select()
      .from(position)
      .where(eq(position.positionTakenBy, userId));

    if (positions.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No position available" });
    }

    return res
      .status(200)
      .json({ success: true, message: "positions fetched", positions });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { userRegister, userLogin, addMoney, getAllPositions };
