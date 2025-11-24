import { Request } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { db } from "@repo/db/dist/src";
import { admin, market } from "@repo/db/dist/src";
import { and, eq } from "drizzle-orm";

import { RegisterSchema, LoginSchema } from "@repo/shared/dist/src";
import {
  startMarketQueue,
  closeMarketQueue,
} from "../lib/redis/queue/market.queue";
import { createMarket, editMarket, newMarket } from "@repo/types/dist/src";
import axios from "axios";
// import { newMarket } from "@repo/types/src";

// Admin account registration
const adminRegister = async (req: Request, res: any) => {
  const data = req.body;
  const validateAdminInput = RegisterSchema.safeParse(data);

  if (!validateAdminInput.success) {
    return res.status(400).json(validateAdminInput.error);
  }

  const { email, name, password } = validateAdminInput.data;

  try {
    const isAdminExists = await db
      .select()
      .from(admin)
      .where(eq(admin.email, email));

    if (isAdminExists.length !== 0) {
      return res.status(400).json({
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

    return res.status(200).json({
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

  const { email, password } = validateAdminInput.data;

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

  const validateData = newMarket.safeParse(data);

  if (!validateData.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid data received from admin",
      error: validateData.error,
    });
  }

  try {
    const [createNewMarket] = await db
      .insert(market)
      .values({
        ...validateData.data,
        createdBy: adminId,
      })
      .returning();

    const openQueueDelay =
      (createNewMarket.marketStarts - Math.floor(Date.now() / 1000)) * 1000;

    await startMarketQueue.add(
      "market_open",
      { marketId: createNewMarket.id },
      { delay: openQueueDelay }
    );

    const closingDelay =
      createNewMarket.cryptoInterval === "1d"
        ? createNewMarket.marketEnds! + 2
        : createNewMarket.marketEnds! + 62;
    const closeQueueDelay =
      (closingDelay - Math.floor(Date.now() / 1000)) * 1000;

    await closeMarketQueue.add(
      "market_close",
      { marketId: createNewMarket.id },
      { delay: closeQueueDelay }
    );

    return res.status(200).json({
      success: true,
      message: "Market created successfully and added to queue",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Delete market
const deleteMarket = async (req: Request, res: any) => {
  const marketId = req.query.marketId;

  // @ts-ignore
  const adminId = req.adminId;

  try {
    const deleteMarketById = await db
      .delete(market)
      .where(
        and(eq(market.id, marketId!.toString()), eq(market.createdBy, adminId))
      )
      .returning();

    if (deleteMarketById.length === 0) {
      return res.status(400).json({
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
const marketModify = async (req: Request, res: any) => {
  const data = req.body;

  // @ts-ignore
  const adminId = req.adminId;
  const marketId = data.marketId;

  const validateData = editMarket.safeParse(data.data);
  if (validateData.error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid data received" });
  }

  const marketData = validateData.data;
  const cleanData = Object.fromEntries(
    Object.entries(marketData).filter(([_, v]) => v !== undefined)
  );

  try {
    await db
      .update(market)
      .set(cleanData)
      .where(and(eq(market.id, marketId), eq(market.createdBy, adminId)));
    return res
      .status(200)
      .json({ success: true, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Fetch football match
const getFootBallMatches = async (req: Request, res: any) => {
  const data = req.query;
  //@ts-ignore
  const admin = req.adminId;
  console.log(admin);

  console.log(data.date);

  const date = data.date;

  // return res.status(200).json({message: "hey there"})

  try {
    const reqFootBallApi = await axios.get(
      "https://v3.football.api-sports.io/fixtures",
      {
        params: {
          date,
        },
        headers: {
          "x-apisports-key": process.env.FOOTBALL_SECRET,
        },
      }
    );

    const data = reqFootBallApi.data.response;

    const matches = data.filter((mt: any) => mt.fixture.status.long === "Not Started").map((m: any) => ({
        id: m.fixture.id,
      time: m.fixture.timestamp,
      venue: {
        name: m.fixture.venue.name,
        city: m.fixture.venue.city,
      },
      league: {
        id: m.league.id,
        name: m.league.name,
        season: m.league.season,
      },
      teams: {
        home: {
          id: m.teams.home.id,
          name: m.teams.home.name,
          logo: m.teams.home.logo,
        },
        away: {
          id: m.teams.away.id,
          name: m.teams.away.name,
          logo: m.teams.away.logo,
        },
      },
    }))
  
    // const matches = data.map((m: any) => ({
    //   id: m.fixture.id,
    //   time: m.fixture.timestamp,
    //   venue: {
    //     name: m.fixture.venue.name,
    //     city: m.fixture.venue.city,
    //   },
    //   league: {
    //     id: m.league.id,
    //     name: m.league.name,
    //     season: m.league.season,
    //   },
    //   teams: {
    //     home: {
    //       id: m.teams.home.id,
    //       name: m.teams.home.name,
    //       logo: m.teams.home.logo,
    //     },
    //     away: {
    //       id: m.teams.away.id,
    //       name: m.teams.away.name,
    //       logo: m.teams.away.logo,
    //     },
    //   },
    // }));

    console.log(matches);

    return res.status(200).json({ matches });
  } catch (error) {
    console.log(error);
  }
};

export {
  adminRegister,
  adminLogin,
  addNewMarket,
  deleteMarket,
  marketModify,
  getFootBallMatches,
};
