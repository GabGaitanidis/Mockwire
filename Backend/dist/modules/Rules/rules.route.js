"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const rules_controller_1 = require("./rules.controller");
const checkUserId_1 = __importDefault(require("../../middlewares/checkUserId"));
const ruleRouter = express_1.default.Router();
ruleRouter.get("/", auth_middleware_1.requireAuth, checkUserId_1.default, rules_controller_1.getRulesController);
ruleRouter.post("/", auth_middleware_1.requireAuth, checkUserId_1.default, rules_controller_1.createRulesController);
exports.default = ruleRouter;
