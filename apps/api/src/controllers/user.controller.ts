/**
 * This file is for performing
 * User registration
 * User login
 * Add dummy money
 * Get all position for the perticular user
 * Placing bets
 * and Storing pending requests
 */

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { db, market } from "@repo/db/dist/src";
import { position, user } from "@repo/db/dist/src";
import { and, eq } from "drizzle-orm";
import { RegisterSchema, LoginSchema, BuyOrderSchema, type OutcomeInterface, type wsData, newBetData } from "@repo/shared/dist/src";
import { NewOrder, orderProducer } from "../lib/redis/producer/order.producer";
import { OrderStore, orderStore } from "../lib/redis/rStore/orderStore";

// Pending bets interface
interface pendingBet {
  userId: string
  marketId: string
  betType: string
  betQty: number
  outcomes: OutcomeInterface[]
  selectedOutcome: string
  selectedOutcomeIndex: number
  res: Response
}

// Store pending bets
export const pendingBets = new Map<string, pendingBet>();

// ===================
// User registration
// ===================
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

// ===================
// User login
// ===================
const userLogin = async (req: Request, res: any) => {
  const data = req.body;

  console.log(data);

  const validateData = LoginSchema.safeParse(data);

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

// ===================
// Add dummy money
// ===================
const addMoney = async (req: Request, res: any) => {
  const data = req.body;

  // @ts-ignore
  const userId = req.userId;

  try {
    const deposit = await db
      .update(user)
      .set({
        walletBalance: data.amount,
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

// ===========================================
// Get all positions for the perticular user
// ===========================================
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

// ===============
// Place bets
// ===============
const placeBet = async (req: Request, res: any) => {

  const data = req.body;// betQty, betType, marketId, selectedOutcome


  // @ts-ignore
  const userId = req.userId

  try {
    const [marketData] = await db.select().from(market).where(and(
      eq(market.marketId, data.marketId),
      eq(market.currentStatus, "open")
    ))

    if (!marketData) {
      return res.status(400).json({ success: true, message: "Error: market status is not open or the market with the provided id does not exists" })
    }

    // Generate order id
    const orderId = uuidv4()

    // Get outcomes
    const outcomes = marketData.outcomes;

    // Get the index
    const selectedOutcomeIndex = outcomes.findIndex((otcm) => otcm.title === data.selectedOutcome)

    // New order data, will be streamed to price engine
    const newOrderData: NewOrder = {
      betQty: data.betQty,
      betType: data.betType,
      orderId: orderId,
      outcomes,
      selectedOutcomeIndex
    }

    // Order store, will be stored in Redis in memory
    const orderStoreData: OrderStore = {
      betQty: data.betQty,
      betType: data.betType,
      marketId: data.marketId,
      orderId,
      outcomes,
      selectedOutcome: data.selectedOutcome,
      selectedOutcomeIndex,
      userId
    }

    // Storing and streaming data
    await orderStore({ order: orderStoreData })
    await orderProducer({ orderData: newOrderData })


    return res.status(200).json({ success: true, message: "Order received" })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" })
  }

}

export { userRegister, userLogin, addMoney, getAllPositions, placeBet };
