import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

function getTokenFromRequest(req: Request): string | undefined {
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization;
  if (!authHeader) return undefined;

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return undefined;

  return token;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };

    next();
  } catch (err) {
    console.error("requireAuth error", err);
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}
