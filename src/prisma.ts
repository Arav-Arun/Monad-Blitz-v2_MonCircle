import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

let isConnected = false

export const connectDB = async () => {
    if (isConnected) return
    await mongoose.connect(MONGODB_URI)
    isConnected = true
    console.log("✅ MongoDB connected")
}

export default mongoose
