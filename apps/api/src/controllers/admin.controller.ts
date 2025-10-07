import { Request } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

import { db } from "@repo/db/dist/src";
import { admin, market } from "@repo/db/dist/src";
import { and, eq } from "drizzle-orm";
import {
  closeMarketQueue,
  startMarketQueue,
} from "../queueProducer/marketQueue";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { RegisterSchema, LoginSchema, MarketSchema, validateEditData, MarketCreationSchema} from "@repo/shared/dist/src"

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
const createMarket = async (req: Request, res: any) => {
  const data = req.body;

  // @ts-ignore
  const adminId = req.adminId;

  const validateData = MarketCreationSchema.safeParse(data);
  console.log(validateData);


  if (!validateData.success) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid data received from admin",
        error: validateData.error,
      });
  }

  const { title, marketStarts, marketEnds, settlement, description, marketCategory, marketType, thumbnailImage, outcomes } = validateData.data;

  try {
    const [createBinaryMarket] = await db
      .insert(market)
      .values({
        marketCreatedBy: adminId,
        marketId: uuidv4(),
        marketTitle: title,
        marketOverview: description,
        marketSettlement: settlement,
        marketCategory: marketCategory,
        marketType,
        thumbnailImage: thumbnailImage,
        marketStarts,
        marketEnds,
        outcomesAndPrices: outcomes
      })
      .returning();
    console.log("hola");
    console.log(createBinaryMarket.marketStarts);

    console.log(createBinaryMarket.marketStarts - (Math.floor(new Date().getTime() / 1000)))


    // market start queue
    await startMarketQueue.add(
      "start_market",
      { id: createBinaryMarket.marketId },
      { delay: ((createBinaryMarket.marketStarts) - (Math.floor(new Date().getTime() / 1000))) * 1000 }
    );

    // market close queue
    await closeMarketQueue.add(
      "close_market",
      { id: createBinaryMarket.marketId },
      { delay: ((createBinaryMarket.marketEnds) - (Math.floor(new Date().getTime() / 1000))) * 1000 }
    );

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
      .json({ success: true, message: `Delete success for ${marketId}` });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const editMarketStatus = async (req: Request, res: any) => {
  const data = req.query.status;
  const marketId = req.query.marketId;
  // @ts-ignore
  const adminId = req.adminId;

  const allowedInputs = [
    "not_started",
    "open",
    "settled",
    "cancelled",
  ] as const;

  const status = allowedInputs.find(
    (s) => s === data!.toString()
  );

  if (!status || typeof status === "undefined") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid status code" });
  }

  try {
    const updateMarket = await db
      .update(market)
      .set({
        currentStatus: status,
      })
      .where(
        and(
          eq(market.marketId, marketId!.toString()),
          eq(market.marketCreatedBy, adminId)
        )
      )
      .returning();

    if (updateMarket.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Unable change the status" });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: "Update success",
        current_status: updateMarket[0].currentStatus,
      });
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
  console.log(data);
  
  // @ts-ignore
  const adminId = req.adminId

  const marketId = data.marketId

  const validate = validateEditData.safeParse(data)
  console.log(validate);
  
  if (validate.error) {
    return res.status(400).json({ success: false, message: "Invalid data received" })
  }


  const marketData = validate.data;
  console.log(marketData);

  const cleanData = Object.fromEntries(Object.entries(marketData).filter(([_, v]) => v !== undefined))
  console.log(cleanData);
  


try {
    await db.update(market).set(cleanData).where(and(
      eq(market.marketId, marketId),
      eq(market.marketCreatedBy, adminId)
    ))
  
    return res.status(200).json({success: true, message: "Updated successfully"})
} catch (error) {
  console.log(error);
      return res.status(500).json({success: false, message: "Internal server error"})

}



}

// logout function goes here



// Upload thumbnail image
const fileUpload = async (req: Request, res: any) => {
  const file = req.file;

  if (typeof file !== "object") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid file type received" });
  }

  const s3Client = new S3Client({
    region: "auto",
    endpoint: `${process.env.CLOUDFLARE_ENDPOINT}`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true,
  });

  const fileName = new Date().getTime() + "_" + file.originalname;

  const uploadParams = {
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(file.buffer),
    ContentType: file.mimetype,
  };

  // TODO: Implement image resize using Sharp before uplaoding it to r2
  try {
    const upload = await s3Client.send(new PutObjectCommand(uploadParams));

    if (upload.$metadata.httpStatusCode === 200) {
      return res.status(201).json({
        success: true,
        message: "Thumbnail image uploaded successfully",
        fileUrl: `${process.env.CLOUDFLARE_CDN_URL}/${fileName}`,
      });
    }
    // if failed, status code is not 200
    return res.status(400).json({
      success: false,
      message: "Thumbnail image upload failed",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, message: "Internal server error" });
  }
};

export {
  adminRegister,
  adminLogin,
  createMarket,
  deleteMarket,
  // editMarketStatus,
  fileUpload,
  editMarket
};
