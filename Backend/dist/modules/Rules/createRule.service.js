"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repo_1 = require("../User/user.repo");
const rules_repo_1 = require("./rules.repo");
const rule_validation_1 = require("./rule.validation");
// createRule.service.ts
async function createRuleService(userId, body) {
    const { endpoint, dataSchema, latency, errorRate, statusCodes } = (0, rule_validation_1.validateCreateRule)(body);
    const apiKey = await (0, user_repo_1.getUsersAPIKey)(userId);
    // We deleted the transformedStatusCodes block entirely
    const rule = await (0, rules_repo_1.createRule)(userId, endpoint, dataSchema, apiKey, latency, errorRate, statusCodes);
    return { rule };
}
exports.default = createRuleService;
