import { Router } from "express"
import { Order } from "../models/Order"
import { authenticate } from "../middleware/auth"
import { RewardService } from "../services/reward.service"

const router = Router()

router.post("/", authenticate, async (req, res) => {
    const { platformId, sellerId, userId, amount, orderId } = req.body
    const platform = (req as any).platform

    if (platform._id.toString() !== platformId) {
        return res.status(403).json({ error: "platformId mismatch" })
    }
    if (!userId || !amount || !orderId) {
        return res.status(400).json({ error: "Missing required fields: userId, amount, orderId" })
    }

    try {
        const { platformEarned, sellerEarned } = await RewardService.calculateReward(
            platformId,
            amount,
            sellerId
        )

        await Order.create({
            orderId,
            platformId,
            sellerId: sellerId || null,
            userId,
            amount,
            earned: platformEarned + sellerEarned
        })

        const newBalances = await RewardService.updateBalances(
            platformId,
            userId,
            platformEarned,
            sellerEarned,
            sellerId
        )

        res.json({
            earned: { platform: platformEarned, seller: sellerEarned },
            newBalances
        })
    } catch (err: any) {
        res.status(400).json({ error: err.message })
    }
})

export default router
