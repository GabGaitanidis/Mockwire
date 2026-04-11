"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
exports.getMe = getMe;
const auth_validation_1 = require("./auth.validation");
const authCookies_1 = require("../../utils/authCookies");
const auth_service_1 = require("./auth.service");
async function register(req, res, next) {
    try {
        const { name, email, password } = (0, auth_validation_1.validateRegister)(req.body);
        const result = await (0, auth_service_1.registerUser)({ name, email, password });
        (0, authCookies_1.setAuthCookies)(res, result.accessToken, result.refreshToken);
        return res.status(201).json({
            message: "User registered successfully",
            user: result.user,
        });
    }
    catch (error) {
        next(error);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = (0, auth_validation_1.validateLogin)(req.body);
        const result = await (0, auth_service_1.loginUser)({ email, password });
        (0, authCookies_1.setAuthCookies)(res, result.accessToken, result.refreshToken);
        return res.json({
            message: "Logged in successfully",
            user: result.user,
        });
    }
    catch (error) {
        next(error);
    }
}
async function refresh(req, res, next) {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            return res.status(401).json({ message: "Missing refresh token" });
        }
        const result = await (0, auth_service_1.refreshSession)(token);
        (0, authCookies_1.setAuthCookies)(res, result.accessToken, result.refreshToken);
        return res.json({ message: "Tokens refreshed" });
    }
    catch (error) {
        next(error);
    }
}
async function logout(req, res, next) {
    try {
        await (0, auth_service_1.logoutUser)(req.cookies?.refreshToken);
        (0, authCookies_1.clearAuthCookies)(res);
        return res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        (0, authCookies_1.clearAuthCookies)(res);
        next(error);
    }
}
async function getMe(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await (0, auth_service_1.getMeUser)(Number(req.user.id));
        return res.json({
            message: "Authenticated user",
            user,
        });
    }
    catch (error) {
        next(error);
    }
}
