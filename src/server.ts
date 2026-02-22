import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./prisma"

import platformRoutes from "./routes/platform.routes"
import sellerRoutes from "./routes/seller.routes"
import orderRoutes from "./routes/order.routes"
import userRoutes from "./routes/user.routes"
import withdrawRoutes from "./routes/withdraw.routes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB()

// Health check
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Routes
app.use("/v1/platforms", platformRoutes)
app.use("/v1/sellers", sellerRoutes)
app.use("/v1/orders", orderRoutes)
app.use("/v1/users", userRoutes)
app.use("/v1/withdraw", withdrawRoutes)

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error"
    })
})

app.listen(PORT, () => {
    console.log(`🚀 MON Loyalty API running on port ${PORT}`)
})
