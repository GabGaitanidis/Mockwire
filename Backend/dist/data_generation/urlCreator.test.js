"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const urlCreator_1 = __importDefault(require("./urlCreator"));
(0, vitest_1.describe)("urlCreator", () => {
    (0, vitest_1.test)("builds expected mock API URL from inputs", () => {
        const url = (0, urlCreator_1.default)("ABC123", "/products");
        (0, vitest_1.expect)(url).toBe("http://localhost:5000/dynamic/api/mock/ABC123/products");
    });
});
