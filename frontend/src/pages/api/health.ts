import type { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "glacier-scan-frontend",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  })
}
