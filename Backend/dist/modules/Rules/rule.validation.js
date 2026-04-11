"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateRule = validateCreateRule;
const zod_1 = require("zod");
const createRuleSchema = zod_1.z.object({
    endpoint: zod_1.z.string().min(1).regex(/^\//, "endpoint must start with '/'"),
    dataSchema: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    latency: zod_1.z.number().int().min(0).max(30000).optional().default(0),
    errorRate: zod_1.z.number().int().min(0).max(100).optional().default(0),
    statusCodes: zod_1.z
        .record(zod_1.z.string(), zod_1.z.object({
        weight: zod_1.z.number().min(0).max(100),
        message: zod_1.z.string().min(1),
    }))
        .optional()
        .default({ "200": { weight: 100, message: "OK" } })
        .refine((data) => {
        const weights = Object.values(data).map((item) => item.weight);
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        return totalWeight === 100;
    }, {
        message: "The sum of status code weights must equal 100%",
    }),
});
function validateCreateRule(data) {
    return createRuleSchema.parse(data);
}
