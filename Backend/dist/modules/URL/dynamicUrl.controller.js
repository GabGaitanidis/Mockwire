"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamicUrlData = getDynamicUrlData;
const getDynamicsUrlData_service_1 = __importDefault(require("./getDynamicsUrlData.service"));
const statusCodePick_1 = __importDefault(require("../../data_generation/statusCodePick"));
async function getDynamicUrlData(req, res) {
    const rawParams = {
        apiKey: req.params.apiKey,
        endpoint: req.params.endpoint,
    };
    const result = await (0, getDynamicsUrlData_service_1.default)(rawParams);
    if (!result) {
        return res.status(404).json({ message: "No data for this" });
    }
    const { mockData, latency, errorRate, statusCodes } = result;
    if (latency > 0) {
        await new Promise((resolve) => setTimeout(resolve, latency));
    }
    const { code: statusCode, message: statusMessage } = (0, statusCodePick_1.default)(statusCodes);
    return res.status(statusCode).json({
        statusCode,
        message: statusMessage,
        data: mockData,
    });
}
