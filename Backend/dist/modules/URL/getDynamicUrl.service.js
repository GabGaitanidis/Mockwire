"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_repo_1 = require("./url.repo");
async function getDynamicUrlService(userId) {
    const url = await (0, url_repo_1.getDynamicUrl)(userId);
    if (!url) {
        throw new Error("No url found");
    }
    const urlString = url.map((u) => u.url);
    return urlString;
}
exports.default = getDynamicUrlService;
