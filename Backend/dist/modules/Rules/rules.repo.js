"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRulesByUser = getRulesByUser;
exports.createRule = createRule;
exports.getEndpoint = getEndpoint;
exports.bindUrlToRule = bindUrlToRule;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm"); //
async function getRulesByUser(userId) {
    const urls = await db_1.db
        .select()
        .from(schema_1.rulesTable)
        .where((0, drizzle_orm_1.eq)(schema_1.rulesTable.user_id, userId));
    return urls;
}
async function createRule(userId, endpoint, dataSchema, apiKey, latency = 0, errorRate = 0, statusCodes) {
    const values = {
        user_id: userId,
        endpoint,
        dataSchema,
        api_key: apiKey,
        latency,
        errorRate,
        statusCodes,
    };
    const rule = await db_1.db.insert(schema_1.rulesTable).values(values).returning();
    return rule[0];
}
async function bindUrlToRule(ruleId, urlId) {
    const updated = await db_1.db
        .update(schema_1.rulesTable)
        .set({ url_id: urlId })
        .where((0, drizzle_orm_1.eq)(schema_1.rulesTable.id, ruleId))
        .returning();
    return updated;
}
async function getEndpoint(userId, ruleId) {
    const data = await db_1.db
        .select({ endpoint: schema_1.rulesTable.endpoint })
        .from(schema_1.rulesTable)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.rulesTable.user_id, userId), (0, drizzle_orm_1.eq)(schema_1.rulesTable.id, ruleId)));
    return data[0]?.endpoint;
}
