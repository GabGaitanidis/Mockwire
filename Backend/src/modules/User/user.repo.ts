import { eq, and } from "drizzle-orm";
import { db } from "../../db";
import { rulesTable, userTable } from "../../db/schema";
async function getUsers() {
  const users = await db.query.userTable.findMany();
  return users;
}

async function getUsersAPIKey(userId: number) {
  const result = await db
    .select({ apiKey: userTable.api_key })
    .from(userTable)
    .where(eq(userTable.id, userId));

  if (result.length === 0) {
    return null;
  }

  return result[0].apiKey;
}

async function getUserAPIKeyWithEndpoint(apiKey: string, endpoint: string) {
  const results = await db
    .select({ apiKey: userTable.api_key })
    .from(userTable)
    .innerJoin(rulesTable, eq(userTable.id, rulesTable.user_id))
    .where(
      and(eq(userTable.api_key, apiKey), eq(rulesTable.endpoint, endpoint)),
    );

  return results;
}

async function createUser(
  name: string,
  api_key: string,
  email: string,
  password: string,
) {
  const user = await db
    .insert(userTable)
    .values({
      name: name,
      email: email,
      password: password,
      api_key: api_key,
    })
    .returning();

  return user;
}

async function updateUserById(
  targetUserId: number,
  data: Partial<{ name: string; email: string; password: string }>,
) {
  const updated = await db
    .update(userTable)
    .set(data)
    .where(eq(userTable.id, targetUserId))
    .returning({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      api_key: userTable.api_key,
      role: userTable.role,
      createdAt: userTable.createdAt,
    });

  return updated[0] ?? null;
}

async function deleteUserById(targetUserId: number) {
  const deleted = await db
    .delete(userTable)
    .where(eq(userTable.id, targetUserId))
    .returning({ id: userTable.id });

  return deleted[0] ?? null;
}

export {
  createUser,
  getUsers,
  getUsersAPIKey,
  getUserAPIKeyWithEndpoint,
  updateUserById,
  deleteUserById,
};
