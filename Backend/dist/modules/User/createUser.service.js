"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiKeyGenerator_1 = require("../../data_generation/apiKeyGenerator");
const user_repo_1 = require("./user.repo");
async function createUserService(name, email, password) {
    const key = (0, apiKeyGenerator_1.generateApiKey)();
    const user = await (0, user_repo_1.createUser)(name, key, email, password);
    return user;
}
exports.default = createUserService;
