"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const API_HOST = process.env.API_HOST;
function urlGenerator(apiKey, endpoint) {
    const url = API_HOST + `/${apiKey}${endpoint}`;
    return url;
}
exports.default = urlGenerator;
