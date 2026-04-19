import { urlTable } from "../../db/schema";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";

async function getDynamicUrl(userId: number = 1) {
  const url = await db
    .select()
    .from(urlTable)
    .where(eq(urlTable.user_id, userId));
  return url;
}

async function createDynamicUrl(
  userId: number = 1,
  urlString: string,
  rulesId: number,
) {
  const inserted = await db
    .insert(urlTable)
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

async function updateDynamicUrlById(
  userId: number,
  urlId: number,
  url: string,
) {
  const updated = await db
    .update(urlTable)
    .set({ url })
    .where(and(eq(urlTable.user_id, userId), eq(urlTable.id, urlId)))
    .returning();

  return updated[0] ?? null;
}

async function deleteDynamicUrlById(userId: number, urlId: number) {
  const deleted = await db
    .delete(urlTable)
    .where(and(eq(urlTable.user_id, userId), eq(urlTable.id, urlId)))
    .returning({ id: urlTable.id });

  return deleted[0] ?? null;
}

async function deleteUrlsByRuleId(userId: number, ruleId: number) {
  return db
    .delete(urlTable)
    .where(and(eq(urlTable.user_id, userId), eq(urlTable.rules_id, ruleId)));
}

async function deleteUrlsByUserId(userId: number) {
  return db.delete(urlTable).where(eq(urlTable.user_id, userId));
}

export {
  createDynamicUrl,
  getDynamicUrl,
  updateDynamicUrlById,
  deleteDynamicUrlById,
  deleteUrlsByRuleId,
  deleteUrlsByUserId,
};
