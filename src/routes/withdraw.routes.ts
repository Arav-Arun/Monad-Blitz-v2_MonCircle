import { Router } from "express"
import { User } from "../models/User"
import { authenticate } from "../middleware/auth"
import { RewardService } from "../services/reward.service"

const router = Router()

/**
 * POST /v1/withdraw
 *
 * Off-chain: Deducts user balance from DB.
 * On-chain (future): Will trigger Monad smart contract to mint/transfer MON tokens.
 *
 * Architecture: Hybrid — track in DB, settle on-chain on request.
 */
router.post("/", authenticate, async (req, res) => {
    const { platformId, sellerId, userId, amount, walletAddress } = req.body
    const platform = (req as any).platform

    if (platform._id.toString() !== platformId) {
        return res.status(403).json({ error: "platformId mismatch" })
    }
    if (!userId || !amount || !walletAddress) {
        return res.status(400).json({ error: "Missing required fields: userId, amount, walletAddress" })
    }

    try {
        // Step 1: Deduct balance in MongoDB (off-chain)
        const newBalance = await RewardService.redeem(platformId, userId, amount, sellerId)

        // Step 2: TODO — Monad on-chain settlement
        // Will call MonLoyalty smart contract to mint/transfer MON tokens
        // const tx = await monadService.settle(walletAddress, amount)
        const withdrawal = {
            userId,
            platformId,
            sellerId: sellerId || null,
            amount,
            walletAddress,
            status: "PENDING_CHAIN", // Becomes "SETTLED" after Monad TX
            newBalance
        }

        res.json({
            message: "Withdrawal initiated (off-chain deducted, on-chain settlement pending)",
            withdrawal
        })
    } catch (err: any) {
        res.status(400).json({ error: err.message })
    }
})

export default router
