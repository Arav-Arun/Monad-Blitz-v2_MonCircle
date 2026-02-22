import mongoose, { Schema, Document } from "mongoose"

export interface ISeller extends Document {
    name: string
    platformId: string
    rewardRate: number
    createdAt: Date
}

const SellerSchema = new Schema<ISeller>({
    name: { type: String, required: true },
    platformId: { type: String, required: true, index: true },
    rewardRate: { type: Number, default: 0.0002 },
    createdAt: { type: Date, default: Date.now }
})

export const Seller = mongoose.model<ISeller>("Seller", SellerSchema)
