import dotenv from "dotenv"
import express  from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config()

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET, HEAD, PUT, POST, DELETE",
    credentials: true
}))

// Routes
import useUserRouter from "./routes/user.route"
app.use("/api/v0/user", useUserRouter)
import useAdminRouter from "./routes/admin.route"
app.use("/api/v0/admin", useAdminRouter)
import marketRouter from "./routes/market.route"
app.use("/api/v0/market", marketRouter)