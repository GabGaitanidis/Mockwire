"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const dataGenerator_1 = __importDefault(require("./dataGenerator"));
(0, vitest_1.describe)("dataGenerator", () => {
    (0, vitest_1.test)("generates attributes based on faker schema map", () => {
        const data = (0, dataGenerator_1.default)({
            firstName: "person.firstName",
            email: "internet.email",
            city: "location.city",
        });
        (0, vitest_1.expect)(data).toHaveProperty("firstName");
        (0, vitest_1.expect)(data).toHaveProperty("email");
        (0, vitest_1.expect)(data).toHaveProperty("city");
        (0, vitest_1.expect)(typeof data.firstName).toBe("string");
        (0, vitest_1.expect)(typeof data.email).toBe("string");
        (0, vitest_1.expect)(typeof data.city).toBe("string");
    });
});
