"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDynamicApi = validateDynamicApi;
const zod_1 = require("zod");
const dynamicApiSchema = zod_1.z.object({
    apiKey: zod_1.z.string().min(1),
    endpoint: zod_1.z.string().min(1),
});
function validateDynamicApi(data) {
    return dynamicApiSchema.parse(data);
}
