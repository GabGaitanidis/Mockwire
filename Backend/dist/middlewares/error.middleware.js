"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const AppError_1 = require("../errors/AppError");
function notFoundHandler(_req, res) {
    return res.status(404).json({ message: "Route not found" });
}
function errorHandler(err, _req, res, _next) {
    console.error("ErrorHandler:", err);
    if (err instanceof AppError_1.AppError) {
        return res.status(err.status).json({
            message: err.message,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: err.message || "Internal Server Error",
        });
    }
    return res.status(500).json({
        message: "Internal Server Error",
    });
}
