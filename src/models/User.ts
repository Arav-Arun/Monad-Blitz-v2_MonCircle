import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
    userId: string       // External user ID from the platform
    platformId: string
    sellerId: string | null
    balance: number
    lastActive: Date
}

const UserSchema = new Schema<IUser>({
    userId: { type: String, required: true },
    platformId: { type: String, required: true },
    sellerId: { type: String, default: null },
    balance: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
})

// Compound unique index — this is the scoping logic
// A user has one record per (userId + platformId + sellerId) combination
UserSchema.index({ userId: 1, platformId: 1, sellerId: 1 }, { unique: true })

export const User = mongoose.model<IUser>("User", UserSchema)
