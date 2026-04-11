"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const url_controller_1 = require("./url.controller");
const dynamicUrl_controller_1 = require("./dynamicUrl.controller");
const checkUserId_1 = __importDefault(require("../../middlewares/checkUserId"));
const dynamicRouter = express_1.default.Router();
dynamicRouter.get("/", auth_middleware_1.requireAuth, checkUserId_1.default, url_controller_1.getUrlRoute);
dynamicRouter.post("/:ruleId", auth_middleware_1.requireAuth, checkUserId_1.default, url_controller_1.createUrlRoute);
dynamicRouter.get("/api/mock/:apiKey/:endpoint", dynamicUrl_controller_1.getDynamicUrlData);
exports.default = dynamicRouter;
