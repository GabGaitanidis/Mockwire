"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rules_repo_1 = require("../Rules/rules.repo");
const urlCreator_1 = __importDefault(require("../../data_generation/urlCreator"));
const url_repo_1 = require("./url.repo");
const url_validation_1 = require("./url.validation");
const user_repo_1 = require("../User/user.repo");
async function createDynamicUrlService(userId, params) {
    const validation = url_validation_1.createUrlSchema.safeParse(params);
    if (!validation.success) {
        throw new Error(`Validation failed: ${validation.error.message}`);
    }
    const { ruleId } = validation.data;
    const apiKey = await (0, user_repo_1.getUsersAPIKey)(userId);
    const endpoint = await (0, rules_repo_1.getEndpoint)(userId, ruleId);
    const urlString = (0, urlCreator_1.default)(apiKey, endpoint);
    const createdUrl = await (0, url_repo_1.createDynamicUrl)(userId, urlString, ruleId);
    if (createdUrl?.id) {
        await (0, rules_repo_1.bindUrlToRule)(ruleId, createdUrl.id);
    }
    return createdUrl;
}
exports.default = createDynamicUrlService;
