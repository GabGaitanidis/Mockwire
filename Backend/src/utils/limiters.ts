import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests, slow down." },
});

export const apiKeyLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  keyGenerator: (req) => {
    const headerKey = req.headers["x-api-key"];
    if (typeof headerKey === "string" && headerKey.trim()) {
      return headerKey;
    }

    const fromPath = req.originalUrl.match(/\/api\/mock\/([^/]+)\//)?.[1];
    if (fromPath) {
      return fromPath;
    }

    return ipKeyGenerator(req.ip ?? "");
  },
  handler: (req, res) => {
    res.status(429).json({ error: "Rate limit exceeded for this API key." });
  },
});

export const authLimiter = rateLimit({
  windowMs: 60_000,
  limit: 5,
  message: { error: "Too many auth attempts. Try again in a minute." },
});
