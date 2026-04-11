"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamicUrl = createDynamicUrl;
exports.getDynamicUrl = getDynamicUrl;
const schema_1 = require("../../db/schema");
const db_1 = require("../../db");
const drizzle_orm_1 = require("drizzle-orm");
async function getDynamicUrl(userId = 1) {
    const url = await db_1.db
        .select()
        .from(schema_1.urlTable)
        .where((0, drizzle_orm_1.eq)(schema_1.urlTable.user_id, userId));
    return url;
}
async function createDynamicUrl(userId = 1, urlString, rulesId) {
    const inserted = await db_1.db
        .insert(schema_1.urlTable)
        .values({
        user_id: userId,
        url: urlString,
        rules_id: rulesId,
    })
        .returning();
    if (Array.isArray(inserted)) {
        return inserted[0];
    }
    return inserted;
}
