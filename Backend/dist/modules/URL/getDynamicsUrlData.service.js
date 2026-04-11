"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dataGenerator_1 = __importDefault(require("../../data_generation/dataGenerator"));
const authorizeAPIKey_1 = __importDefault(require("../Auth/authorizeAPIKey"));
const normalizeEndpoint_1 = __importDefault(require("../../utils/normalizeEndpoint"));
const dynamicUrl_repo_1 = require("./dynamicUrl.repo");
const dynamicUrl_validation_1 = require("./dynamicUrl.validation");
async function getDynamicsUrlDataService(params) {
    const { apiKey, endpoint } = (0, dynamicUrl_validation_1.validateDynamicApi)(params);
    const normalizedEndpoint = (0, normalizeEndpoint_1.default)(endpoint);
    const access = await (0, authorizeAPIKey_1.default)(apiKey, normalizedEndpoint);
    if (!access)
        return false;
    const result = await (0, dynamicUrl_repo_1.getDynamicsUrlData)(apiKey, normalizedEndpoint);
    if (!result || !result.length) {
        return null;
    }
    const schema = result[0].dataSchema;
    const latency = result[0].latency || 0;
    const errorRate = result[0].errorRate || 0;
    const statusCodes = result[0].statusCodes;
    if (!schema || typeof schema !== "object") {
        return null;
    }
    const mockData = (0, dataGenerator_1.default)(schema);
    return { mockData, latency, errorRate, statusCodes };
}
exports.default = getDynamicsUrlDataService;
