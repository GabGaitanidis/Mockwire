"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.getUsersAPIKey = getUsersAPIKey;
exports.getUserAPIKeyWithEndpoint = getUserAPIKeyWithEndpoint;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
async function getUsers() {
    const users = await db_1.db.query.userTable.findMany();
    return users;
}
async function getUsersAPIKey(userId) {
    const result = await db_1.db
        .select({ apiKey: schema_1.userTable.api_key })
        .from(schema_1.userTable)
        .where((0, drizzle_orm_1.eq)(schema_1.userTable.id, userId));
    if (result.length === 0) {
        return null;
    }
    return result[0].apiKey;
}
async function getUserAPIKeyWithEndpoint(apiKey, endpoint) {
    const results = await db_1.db
        .select({ apiKey: schema_1.userTable.api_key })
        .from(schema_1.userTable)
        .innerJoin(schema_1.rulesTable, (0, drizzle_orm_1.eq)(schema_1.userTable.id, schema_1.rulesTable.user_id))
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.userTable.api_key, apiKey), (0, drizzle_orm_1.eq)(schema_1.rulesTable.endpoint, endpoint)));
    return results;
}
async function createUser(name, api_key, email, password) {
    const user = await db_1.db
        .insert(schema_1.userTable)
        .values({
        name: name,
        email: email,
        password: password,
        api_key: api_key,
    })
        .returning();
    return user;
}
