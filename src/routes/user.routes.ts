import { Router } from "express"
import { User } from "../models/User"
import { authenticate } from "../middleware/auth"
import { RewardService } from "../services/reward.service"

const router = Router()

// GET /v1/users/:userId/balance?platformId=...&sellerId=...
router.get("/:userId/balance", async (req, res) => {
    const { userId } = req.params
    const { platformId, sellerId } = req.query as { platformId: string; sellerId?: string }

    if (!platformId) return res.status(400).json({ error: "platformId is required" })

    try {
        const user = await User.findOne({
            userId,
            platformId,
            sellerId: sellerId || null
        })
        res.json({ balance: user?.balance || 0 })
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
})

// POST /v1/users/redeem
router.post("/redeem", authenticate, async (req, res) => {
    const { platformId, sellerId, userId, amount } = req.body
    const platform = (req as any).platform

    if (platform._id.toString() !== platformId) {
        return res.status(403).json({ error: "platformId mismatch" })
    }
    if (!userId || !amount) {
        return res.status(400).json({ error: "Missing required fields: userId, amount" })
    }

    try {
        const newBalance = await RewardService.redeem(platformId, userId, amount, sellerId)
        res.json({ message: "Redemption successful", newBalance })
    } catch (err: any) {
        res.status(400).json({ error: err.message })
    }
})

export default router
