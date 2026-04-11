"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const apiKeyGenerator_1 = require("./apiKeyGenerator");
(0, vitest_1.describe)("API Key Generator", () => {
    (0, vitest_1.test)("API Key has 32 length", () => {
        const key = (0, apiKeyGenerator_1.generateApiKey)();
        (0, vitest_1.expect)(key).length(64);
        (0, vitest_1.expect)(typeof key).toBe("string");
    });
});
