import express from "express"

export const app = express()


app.use(express.json())


// Routes

import useUserRouter from "./routes/user.route"
app.use("/api/v1/user", useUserRouter)

import useAdminRouter from "./routes/admin.route"
app.use("/api/v1/admin", useAdminRouter)