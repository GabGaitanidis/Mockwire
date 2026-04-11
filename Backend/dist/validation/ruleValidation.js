"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateRule = validateCreateRule;
const zod_1 = require("zod");
const createRuleSchema = zod_1.z.object({
    endpoint: zod_1.z.string().min(1).regex(/^\//, "endpoint must start with '/'"),
    dataSchema: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    latency: zod_1.z.number().int().min(0).max(30000).optional().default(0),
});
function validateCreateRule(data) {
    return createRuleSchema.parse(data);
}
