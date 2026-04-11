"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
function dataGenerator(dataSchema) {
    const mockData = {};
    for (const [key, fakerPath] of Object.entries(dataSchema)) {
        const parts = fakerPath.split(".");
        let current = faker_1.faker;
        let parent = null;
        for (const part of parts) {
            parent = current;
            current = current[part];
        }
        if (typeof current === "function") {
            mockData[key] = current.call(parent);
        }
        else {
            mockData[key] = current;
        }
    }
    return mockData;
}
exports.default = dataGenerator;
