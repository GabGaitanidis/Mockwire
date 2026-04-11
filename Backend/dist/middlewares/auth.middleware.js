"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jwt_1 = require("../utils/jwt");
function getTokenFromRequest(req) {
    const cookieToken = req.cookies?.accessToken;
    if (cookieToken)
        return cookieToken;
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return undefined;
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token)
        return undefined;
    return token;
}
function requireAuth(req, res, next) {
    try {
        const token = getTokenFromRequest(req);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const payload = (0, jwt_1.verifyAccessToken)(token);
        req.user = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
        };
        next();
    }
    catch (err) {
        console.error("requireAuth error", err);
        return res.status(401).json({ message: "Invalid or expired access token" });
    }
}
