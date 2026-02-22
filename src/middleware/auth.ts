import { Request, Response, NextFunction } from "express"
import { Platform } from "../models/Platform"

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid API key" })
    }

    const secretKey = authHeader.split(" ")[1]

    try {
        const platform = await Platform.findOne({ secretKey })
        if (!platform) return res.status(403).json({ error: "Unauthorized" })

            ; (req as any).platform = platform
        next()
    } catch {
        res.status(500).json({ error: "Authentication error" })
    }
}
