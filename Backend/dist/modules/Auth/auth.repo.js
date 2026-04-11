"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = findUserByEmail;
exports.findUserById = findUserById;
exports.createUser = createUser;
exports.updateRefreshToken = updateRefreshToken;
exports.findPublicUserById = findPublicUserById;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
async function findUserByEmail(email) {
    const users = await db_1.db
        .select()
        .from(schema_1.userTable)
        .where((0, drizzle_orm_1.eq)(schema_1.userTable.email, email))
        .limit(1);
    return users[0] ?? null;
}
async function findUserById(id) {
    const users = await db_1.db
        .select()
        .from(schema_1.userTable)
        .where((0, drizzle_orm_1.eq)(schema_1.userTable.id, id))
        .limit(1);
    return users[0] ?? null;
}
async function createUser(data) {
    const inserted = await db_1.db.insert(schema_1.userTable).values(data).returning();
    return inserted[0];
}
async function updateRefreshToken(userId, token) {
    await db_1.db
        .update(schema_1.userTable)
        .set({ refresh_token: token })
        .where((0, drizzle_orm_1.eq)(schema_1.userTable.id, userId));
}
async function findPublicUserById(id) {
    const users = await db_1.db
        .select({
        id: schema_1.userTable.id,
        name: schema_1.userTable.name,
        email: schema_1.userTable.email,
        api_key: schema_1.userTable.api_key,
        createdAt: schema_1.userTable.createdAt,
    })
        .from(schema_1.userTable)
        .where((0, drizzle_orm_1.eq)(schema_1.userTable.id, id))
        .limit(1);
    return users[0] ?? null;
}
