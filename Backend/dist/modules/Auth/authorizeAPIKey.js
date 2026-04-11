"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_repo_1 = require("../User/user.repo");
async function authorizeAPIKey(apiKey, endpoint) {
    const results = await (0, user_repo_1.getUserAPIKeyWithEndpoint)(apiKey, endpoint);
    return results.length;
}
exports.default = authorizeAPIKey;
