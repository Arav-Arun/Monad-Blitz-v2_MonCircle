import mongoose, { Schema, Document } from "mongoose"

export interface IOrder extends Document {
    orderId: string
    platformId: string
    sellerId: string | null
    userId: string
    amount: number
    earned: number
    createdAt: Date
}

const OrderSchema = new Schema<IOrder>({
    orderId: { type: String, required: true, unique: true },
    platformId: { type: String, required: true },
    sellerId: { type: String, default: null },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    earned: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
})

export const Order = mongoose.model<IOrder>("Order", OrderSchema)
