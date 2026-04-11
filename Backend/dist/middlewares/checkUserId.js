"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkUserId(req, res, next) {
    const userId = Number(req.user?.id);
    if (!userId || Number.isNaN(userId)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}
exports.default = checkUserId;
