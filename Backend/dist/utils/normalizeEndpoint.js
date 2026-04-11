"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normalizeEndpoint(endpoint) {
    if (!endpoint.startsWith("/")) {
        return `/${endpoint}`;
    }
    return endpoint;
}
exports.default = normalizeEndpoint;
