"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrlSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUrlSchema = zod_1.default.object({
    ruleId: zod_1.default.preprocess((val) => Number(val), zod_1.default.number().int().positive()),
});
