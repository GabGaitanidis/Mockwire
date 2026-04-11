"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrlRoute = createUrlRoute;
exports.getUrlRoute = getUrlRoute;
const createDynamicUrl_service_1 = __importDefault(require("./createDynamicUrl.service"));
const getDynamicUrl_service_1 = __importDefault(require("./getDynamicUrl.service"));
async function createUrlRoute(req, res) {
    const userId = Number(req.user?.id);
    const url = await (0, createDynamicUrl_service_1.default)(userId, req.params);
    res.status(201).json(url);
}
async function getUrlRoute(req, res) {
    const userId = Number(req.user?.id);
    const urls = await (0, getDynamicUrl_service_1.default)(userId);
    res.status(200).json(urls);
}
