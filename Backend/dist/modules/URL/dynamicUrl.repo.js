"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAPIKey = void 0;
exports.getDynamicsUrlData = getDynamicsUrlData;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const authorizeAPIKey_1 = __importDefault(require("../Auth/authorizeAPIKey"));
exports.authorizeAPIKey = authorizeAPIKey_1.default;
async function getDynamicsUrlData(apiKey, endpoint) {
    const result = await db_1.db
        .select({
        dataSchema: schema_1.rulesTable.dataSchema,
        latency: schema_1.rulesTable.latency,
        errorRate: schema_1.rulesTable.errorRate,
        statusCodes: schema_1.rulesTable.statusCodes,
    })
        .from(schema_1.rulesTable)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.rulesTable.api_key, apiKey), (0, drizzle_orm_1.eq)(schema_1.rulesTable.endpoint, endpoint)));
    if (!result.length)
        return false;
    return result;
}
