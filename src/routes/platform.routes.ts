import { Router } from "express"
import { Platform } from "../models/Platform"
import { v4 as uuid } from "uuid"

const router = Router()

router.post("/", async (req, res) => {
    const { name, mode, platformRewardRate } = req.body
    if (!name || !mode) return res.status(400).json({ error: "name and mode are required" })

    try {
        const platform = await Platform.create({
            name,
            mode,
            platformRewardRate: platformRewardRate || 0.0002,
            publicKey: "pk_" + uuid().replace(/-/g, ""),
            secretKey: "sk_" + uuid().replace(/-/g, "")
        })
        res.status(201).json(platform)
    } catch (err: any) {
        res.status(500).json({ error: err.message })
    }
})

export default router
