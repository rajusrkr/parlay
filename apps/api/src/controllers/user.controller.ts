/**
 * This file is for performing
 * User registration
 * User login
 * Add dummy money
 * Get all position for the perticular user
 * Placing bets
 * and Storing pending requests
 */

import { Request } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { db, market, order } from "@repo/db/dist/src";
import { position, user } from "@repo/db/dist/src";
import { and, eq } from "drizzle-orm";
import { RegisterSchema, LoginSchema } from "@repo/shared/dist/src";
import { order as orderValidation } from "@repo/types/dist/src"
import { LMSRLogic } from "../lib/lmsr-logic";
import { Producer } from "../lib/redis/pub";


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
  const userOrderData = req.body;
  // @ts-ignore
  const userId = req.userId

  const { success, data, error } = orderValidation.safeParse(userOrderData)

  if (!success) {
    const errorMessage = `${error.issues[0].path} ${error.issues[0].message}`
    return res.status(400).json({ success: false, message: `Zod validation error, ${errorMessage}` })
  }

  const { betQty, betType, marketId, selectedOutcome } = data;

  try {
    await db.transaction(async (tx) => {
      // 1. Get market details
      const [marketDetails] = await tx.select().from(market).where(and(
        eq(market.marketId, marketId),
        eq(market.currentStatus, "open")
      ))

      const { outcomes } = marketDetails;

      const selectedOutcomeIndex = outcomes.findIndex((outcome) => outcome.title === selectedOutcome)

      // 2. Get user details
      const [userDetails] = await tx.select().from(user).where(eq(user.userId, userId))

      // 3. Call lmst logic
      const lmsrCalculation = new LMSRLogic(outcomes, selectedOutcomeIndex, betQty);


      // 4. buy order
      if (betType === "buy") {
        // 5. User wallet balance check and update
        const { calculatedOutcomes, tradeCost } = lmsrCalculation.buy()
        if (userDetails.walletBalance < tradeCost) {
          throw new Error("Insufficient balance to complete this order")
        }
        const newWalletBalance = userDetails.walletBalance - tradeCost;
        await tx.update(user).set({
          walletBalance: newWalletBalance
        }).where(eq(user.userId, userId))

        /**
         * 6. Check prev position for same market and same
         * outcome. If exists update that else create a new
         * position
         */
        const [prevPosition] = await tx.select().from(position).where(and(
          eq(position.positionTakenBy, userId),
          eq(position.positionTakenFor, selectedOutcome),
          eq(position.positionTakenIn, marketId)
        ))

        if (prevPosition) {
          const newQty = prevPosition.totalQtyAndAvgPrice.totalQty + betQty;
          const newAtTotalCost = prevPosition.totalQtyAndAvgPrice.atTotalCost + tradeCost;
          const newAvgPrice = newAtTotalCost / newQty;

          await tx.update(position).set({
            totalQtyAndAvgPrice: {
              atTotalCost: newAtTotalCost,
              avgPrice: newAvgPrice,
              totalQty: newQty
            }
          }).where(and(
            eq(position.positionTakenBy, userId),
            eq(position.positionTakenFor, selectedOutcome),
            eq(position.positionTakenIn, marketId)
          ))
        } else {
          const avgPrice = tradeCost / betQty;
          await tx.insert(position).values({
            positionId: uuidv4(),
            positionTakenBy: userId,
            positionTakenFor: selectedOutcome,
            positionTakenIn: marketId,
            totalQtyAndAvgPrice: {
              totalQty: betQty,
              avgPrice,
              atTotalCost: tradeCost
            },
            pnL: 0
          })
        }

        // 7. Create a new order
        const avgPrice = tradeCost / betQty
        await tx.insert(order).values({
          orderId: uuidv4(),
          orderPlacedBy: userId,
          orderQty: betQty,
          orderTakenIn: marketId,
          orderType: betType,
          updatedPrices: calculatedOutcomes,
          averageTradedPrice: avgPrice,
          orderPlacedFor: selectedOutcome
        })
        //8. Update market
        await tx.update(market).set({
          outcomes: calculatedOutcomes
        }).where(eq(market.marketId, marketId))
        /**
         * Do redis pub sub from here
         * Data:
         * calculated outcomes
         * market id
         */
        const messageData = {
          calculatedOutcomes,
          marketId
        }
        const messagePublish = new Producer(messageData)
        messagePublish.publishUpdatedPrices()
        // =====================
        // BUY ORDER ENDS HERE
        // =====================          
      } else if (betType === "sell") {
        // 1. Check old position and perform checks
        const [prevPosition] = await tx.select().from(position).where(and(
          eq(position.positionTakenIn, marketId),
          eq(position.positionTakenBy, userId),
          eq(position.positionTakenFor, selectedOutcome)
        ))

        if (!prevPosition) {
          throw new Error("You don't have any quantity to sell")
        }

        if (prevPosition.totalQtyAndAvgPrice.totalQty < betQty) {
          throw new Error("Quantity is not enough to sell")
        }

        // 2.Get user
        const [userDetails] = await tx.select().from(user).where(eq(user.userId, userId));

        // 3. lmsr logic 
        const { calculatedOutcomes, returnToTheUser } = lmsrCalculation.sell()
        // 4. New wallet balance and update wallet balance
        const newWalletBalance = userDetails.walletBalance + returnToTheUser;
        await tx.update(user).set({
          walletBalance: newWalletBalance
        }).where(eq(user.userId, userId))

        // 5. Update position
        const newQty = prevPosition.totalQtyAndAvgPrice.totalQty - betQty;
        const newAvgPrice = prevPosition.totalQtyAndAvgPrice.avgPrice;
        const newAtTotalCost = newQty * newAvgPrice;
        await tx.update(position).set({
          totalQtyAndAvgPrice: {
            totalQty: newQty,
            avgPrice: newAvgPrice,
            atTotalCost: newAtTotalCost
          }
        }).where(and(
          eq(position.positionTakenIn, marketId),
          eq(position.positionTakenBy, userId),
          eq(position.positionTakenFor, selectedOutcome)
        ))
        // 6. Insert order
        function getSellOrderAvgPrice(): number {
          const avgPrice = returnToTheUser / betQty;

          if (avgPrice < 0) {
            const positiveAvgPrice = avgPrice * -1
            return positiveAvgPrice
          }
          return avgPrice
        }

        await tx.insert(order).values({
          orderId: uuidv4(),
          orderPlacedBy: userId,
          orderQty: betQty,
          orderTakenIn: marketId,
          orderType: betType,
          updatedPrices: calculatedOutcomes,
          averageTradedPrice: getSellOrderAvgPrice(),
          orderPlacedFor: selectedOutcome
        })
        // 7. Update market
        await tx.update(market).set({
          outcomes: calculatedOutcomes
        }).where(eq(market.marketId, marketId))
        /**
         * Do redis pub sub from here
         * Data:
         * calculated outcomes
         * market id
         */
        const messageData = {
          calculatedOutcomes,
          marketId
        }
        const messagePublish = new Producer(messageData)
        messagePublish.publishUpdatedPrices()
        // =====================
        // SELL ORDER ENDS HERE
        // =====================   

      }
    })
    return res.status(200).json({ success: true, message: "Order placed successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error })
  }



}

export { userRegister, userLogin, addMoney, getAllPositions, placeBet };
