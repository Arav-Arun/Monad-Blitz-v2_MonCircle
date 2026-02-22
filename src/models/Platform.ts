import mongoose, { Schema, Document } from "mongoose"

export type RewardMode = "SINGLE" | "MULTI" | "HYBRID"

export interface IPlatform extends Document {
    name: string
    publicKey: string
    secretKey: string
    mode: RewardMode
    platformRewardRate: number
    createdAt: Date
}

const PlatformSchema = new Schema<IPlatform>({
    name: { type: String, required: true },
    publicKey: { type: String, required: true, unique: true },
    secretKey: { type: String, required: true, unique: true },
    mode: { type: String, enum: ["SINGLE", "MULTI", "HYBRID"], required: true },
    platformRewardRate: { type: Number, default: 0.0002 },
    createdAt: { type: Date, default: Date.now }
})

export const Platform = mongoose.model<IPlatform>("Platform", PlatformSchema)
