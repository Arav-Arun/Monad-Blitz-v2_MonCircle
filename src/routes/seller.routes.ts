import { Router } from "express"
import { Seller } from "../models/Seller"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post("/", authenticate, async (req, res) => {
    const { name, rewardRate } = req.body
    const platform = (req as any).platform

    if (platform.mode === "SINGLE") {
        return res.status(400).json({ error: "Sellers are not used in SINGLE mode" })
    }
    if (!name) return res.status(400).json({ error: "name is required" })

    try {
        const seller = await Seller.create({
            name,
            platformId: platform._id.toString(),
            rewardRate: rewardRate || 0.0002
        })
        res.status(201).json(seller)
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
})

export default router
