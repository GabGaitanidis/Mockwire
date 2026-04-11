"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRulesController = getRulesController;
exports.createRulesController = createRulesController;
const rules_repo_1 = require("./rules.repo");
const createRule_service_1 = __importDefault(require("./createRule.service"));
async function getRulesController(req, res) {
    const userId = Number(req.user?.id);
    const rules = await (0, rules_repo_1.getRulesByUser)(userId);
    return res.status(200).json({ message: "Success", rules });
}
async function createRulesController(req, res) {
    const userId = Number(req.user?.id);
    const result = await (0, createRule_service_1.default)(userId, req.body);
    return res.status(201).json({
        message: "Success",
        rule: result.rule,
    });
}
