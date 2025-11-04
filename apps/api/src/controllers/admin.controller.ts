import { Request } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { db } from "@repo/db/dist/src";
import { admin, market } from "@repo/db/dist/src";
import { and, eq } from "drizzle-orm";

import { RegisterSchema, LoginSchema, MarketCreationSchema, MarketEditSchema } from "@repo/shared/dist/src"
import { startMarketQueue } from "../lib/redis/bQueue/market.queue";

// Admin account registration
const adminRegister = async (req: Request, res: any) => {
  const data = req.body;
  const validateAdminInput = RegisterSchema.safeParse(data);

  if (!validateAdminInput.success) {
    return res.status(400).json(validateAdminInput.error);
  }

  const { email, name, password } = validateAdminInput.data

  try {
    const isAdminExists = await db
      .select()
      .from(admin)
      .where(eq(admin.email, email));

    if (isAdminExists.length !== 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists with provided email.",
        });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const createAdmin = await db
      .insert(admin)
      .values({
        adminId: uuidv4(),
        name: name,
        email: email,
        password: hashedPassword,
      })
      .returning();

    if (createAdmin.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "db error: unable to create user." });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Admin created successfully",
        adminId: createAdmin[0].adminId,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error.", data });
  }
};

// Admin account login
const adminLogin = async (req: Request, res: any) => {
  const data = req.body;

  const validateAdminInput = LoginSchema.safeParse(data);

  if (!validateAdminInput.success) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }

  const { email, password } = validateAdminInput.data

  try {
    const findAdmin = await db
      .select({
        adminId: admin.adminId,
        password: admin.password,
        role: admin.role,
      })
      .from(admin)
      .where(eq(admin.email, email));

    if (findAdmin.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "This email is not registered" });
    }

    // compare password
    const dbPassword = findAdmin[0].password;

    // compare password
    const compare = bcrypt.compareSync(password, dbPassword!);

    if (!compare) {
      return res
        .status(401)
        .json({ success: false, message: "Wrong credentials" });
    }

    // sign jwt
    const jwtToken = jwt.sign(
      { adminId: findAdmin[0].adminId },
      `${process.env.JWT_SECRET}`
    );

    res.cookie("aAuthToken", jwtToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({ success: true, message: "Login success" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Create a new market
const addNewMarket = async (req: Request, res: any) => {
  const data = req.body;

  // @ts-ignore
  const adminId = req.adminId;

  const validateData = MarketCreationSchema.safeParse(data);

  if (!validateData.success) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid data received from admin",
        error: validateData.error,
      });
  }

  const { title, marketStarts, marketEnds, settlement, description, outcomes, marketCategory } = validateData.data;

  try {
    const [createNewMarket] = await db
      .insert(market)
      .values({
        marketId: uuidv4(),
        title,
        description,
        settlement,
        marketStarts,
        marketEnds,
        outcomes: outcomes,
        marketCategory,
        marketCreatedBy: adminId
      })
      .returning();

    const queueDelayTime = (createNewMarket.marketStarts - Math.floor((Date.now() / 1000))) * 1000;
    await startMarketQueue.add("start_market",
      { marketId: createNewMarket.marketId },
      { delay: queueDelayTime }
    )
    
    return res
      .status(200)
      .json({ success: true, message: "Market created successfully" });


  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }


}

// Delete market
const deleteMarket = async (req: Request, res: any) => {
  const marketId = req.query.marketId;

  // @ts-ignore
  const adminId = req.adminId;

  try {
    const deleteMarketById = await db
      .delete(market)
      .where(
        and(
          eq(market.marketId, marketId!.toString()),
          eq(market.marketCreatedBy, adminId)
        )
      )
      .returning();

    if (deleteMarketById.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: `Nothing found with this id, ${marketId}`,
        });
    }

    return res
      .status(200)
      .json({ success: true, message: `Market deleted, id: ${marketId}` });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Edit market
const editMarket = async (req: Request, res: any) => {
  const data = req.body;

  // @ts-ignore
  const adminId = req.adminId
  const marketId = data.marketId

  const validateData = MarketEditSchema.safeParse(data.data)
  if (validateData.error) {
    return res.status(400).json({ success: false, message: "Invalid data received" })
  }


  const marketData = validateData.data;
  const cleanData = Object.fromEntries(Object.entries(marketData).filter(([_, v]) => v !== undefined))

  try {
    await db.update(market).set(cleanData).where(and(
      eq(market.marketId, marketId),
      eq(market.marketCreatedBy, adminId)
    ))


    return res.status(200).json({ success: true, message: "Updated successfully" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" })

  }



}


export {
  adminRegister,
  adminLogin,
  addNewMarket,
  deleteMarket,
  editMarket
};
