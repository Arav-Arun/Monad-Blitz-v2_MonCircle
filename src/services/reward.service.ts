import { Platform } from "../models/Platform"
import { Seller } from "../models/Seller"
import { User } from "../models/User"

export class RewardService {
    static async calculateReward(platformId: string, amount: number, sellerId?: string) {
        const platform = await Platform.findById(platformId)
        if (!platform) throw new Error("Platform not found")

        let platformEarned = 0
        let sellerEarned = 0

        if (platform.mode === "SINGLE") {
            platformEarned = amount * platform.platformRewardRate
        } else if (platform.mode === "MULTI") {
            if (!sellerId) throw new Error("sellerId required for MULTI mode")
            const seller = await Seller.findById(sellerId)
            if (!seller || seller.platformId !== platformId) throw new Error("Seller not found")
            sellerEarned = amount * seller.rewardRate
        } else if (platform.mode === "HYBRID") {
            if (!sellerId) throw new Error("sellerId required for HYBRID mode")
            const seller = await Seller.findById(sellerId)
            if (!seller || seller.platformId !== platformId) throw new Error("Seller not found")
            sellerEarned = amount * seller.rewardRate * 0.7
            platformEarned = amount * platform.platformRewardRate * 0.3
        }

        return { platformEarned, sellerEarned, mode: platform.mode }
    }

    static async updateBalances(
        platformId: string,
        userId: string,
        platformEarned: number,
        sellerEarned: number,
        sellerId?: string
    ) {
        const results = []

        // Platform-level balance (sellerId = null)
        if (platformEarned > 0) {
            const user = await User.findOneAndUpdate(
                { userId, platformId, sellerId: null },
                { $inc: { balance: platformEarned }, $set: { lastActive: new Date() } },
                { upsert: true, new: true }
            )
            results.push({ scope: "PLATFORM", newBalance: user!.balance })
        }

        // Seller-level balance
        if (sellerEarned > 0 && sellerId) {
            const user = await User.findOneAndUpdate(
                { userId, platformId, sellerId },
                { $inc: { balance: sellerEarned }, $set: { lastActive: new Date() } },
                { upsert: true, new: true }
            )
            results.push({ scope: "SELLER", sellerId, newBalance: user!.balance })
        }

        return results
    }

    static async redeem(platformId: string, userId: string, amount: number, sellerId?: string) {
        const user = await User.findOne({ userId, platformId, sellerId: sellerId || null })
        if (!user || user.balance < amount) throw new Error("Insufficient balance")

        user.balance -= amount
        user.lastActive = new Date()
        await user.save()
        return user.balance
    }
}
