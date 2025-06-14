import dotenv from "dotenv"
import express  from "express";

dotenv.config()

export const app = express()

app.use(express.json())


// Routes
import useUserRouter from "./routes/user.route"
app.use("/api/v0/user", useUserRouter)
import useAdminRouter from "./routes/admin.route"
app.use("/api/v0/admin", useAdminRouter)
import marketRouter from "./routes/market.route"
app.use("/api/v0/market", marketRouter)