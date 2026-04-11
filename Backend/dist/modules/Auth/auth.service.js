"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.refreshSession = refreshSession;
exports.logoutUser = logoutUser;
exports.getMeUser = getMeUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiKeyGenerator_1 = require("../../data_generation/apiKeyGenerator");
const jwt_1 = require("../../utils/jwt");
const auth_repo_1 = require("./auth.repo");
const auth_helpers_1 = require("./auth.helpers");
async function registerUser(input) {
    const existingUser = await (0, auth_repo_1.findUserByEmail)(input.email);
    if (existingUser) {
        const err = new Error("Email already in use");
        err.status = 409;
        throw err;
    }
    const hashedPassword = await bcrypt_1.default.hash(input.password, 10);
    const apiKey = (0, apiKeyGenerator_1.generateApiKey)();
    const user = await (0, auth_repo_1.createUser)({
        name: input.name,
        email: input.email,
        password: hashedPassword,
        api_key: apiKey,
    });
    const accessToken = (0, jwt_1.signAccessToken)({
        sub: String(user.id),
        email: user.email,
        name: user.name,
    });
    const refreshToken = (0, jwt_1.signRefreshToken)({
        sub: String(user.id),
    });
    await (0, auth_repo_1.updateRefreshToken)(user.id, (0, auth_helpers_1.sha256)(refreshToken));
    return {
        user,
        accessToken,
        refreshToken,
    };
}
async function loginUser(input) {
    const user = await (0, auth_repo_1.findUserByEmail)(input.email);
    if (!user) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }
    const passwordMatches = await bcrypt_1.default.compare(input.password, user.password);
    if (!passwordMatches) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }
    const accessToken = (0, jwt_1.signAccessToken)({
        sub: String(user.id),
        email: user.email,
        name: user.name,
    });
    const refreshToken = (0, jwt_1.signRefreshToken)({
        sub: String(user.id),
    });
    await (0, auth_repo_1.updateRefreshToken)(user.id, (0, auth_helpers_1.sha256)(refreshToken));
    return {
        user,
        accessToken,
        refreshToken,
    };
}
async function refreshSession(refreshToken) {
    const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    const user = await (0, auth_repo_1.findUserById)(Number(payload.sub));
    if (!user || !user.refresh_token) {
        throw new Error("Invalid refresh token");
    }
    if ((0, auth_helpers_1.sha256)(refreshToken) !== user.refresh_token) {
        throw new Error("Refresh token mismatch");
    }
    const newAccessToken = (0, jwt_1.signAccessToken)({
        sub: String(user.id),
        email: user.email,
        name: user.name,
    });
    const newRefreshToken = (0, jwt_1.signRefreshToken)({
        sub: String(user.id),
    });
    await (0, auth_repo_1.updateRefreshToken)(user.id, (0, auth_helpers_1.sha256)(newRefreshToken));
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
}
async function logoutUser(refreshToken) {
    if (!refreshToken)
        return;
    try {
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        await (0, auth_repo_1.updateRefreshToken)(Number(payload.sub), null);
    }
    catch {
        // ignore
    }
}
async function getMeUser(userId) {
    const user = await (0, auth_repo_1.findPublicUserById)(userId);
    if (!user) {
        const err = new Error("User not found");
        err.status = 404;
        throw err;
    }
    return user;
}
