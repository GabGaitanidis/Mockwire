import { urlTable } from "../../db/schema";
import { db } from "../../db";
import { and, eq } from "drizzle-orm";

async function getDynamicUrl(userId: number, projectId: number) {
  const url = await db
    .select()
    .from(urlTable)
    .where(and(eq(urlTable.user_id, userId), eq(urlTable.project_id, projectId)));
  return url;
}

async function createDynamicUrl(
  userId: number,
  projectId: number,
  urlString: string,
  rulesId: number,
) {
  const inserted = await db
    .insert(urlTable)
    .values({
      user_id: userId,
      project_id: projectId,
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
  projectId: number,
  urlId: number,
  url: string,
) {
  const updated = await db
    .update(urlTable)
    .set({ url })
    .where(
      and(
        eq(urlTable.user_id, userId),
        eq(urlTable.project_id, projectId),
        eq(urlTable.id, urlId),
      ),
    )
    .returning();

  return updated[0] ?? null;
}

async function deleteDynamicUrlById(
  userId: number,
  projectId: number,
  urlId: number,
) {
  const deleted = await db
    .delete(urlTable)
    .where(
      and(
        eq(urlTable.user_id, userId),
        eq(urlTable.project_id, projectId),
        eq(urlTable.id, urlId),
      ),
    )
    .returning({ id: urlTable.id });

  return deleted[0] ?? null;
}

export {
  createDynamicUrl,
  getDynamicUrl,
  updateDynamicUrlById,
  deleteDynamicUrlById,
};
