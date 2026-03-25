import { db } from "../db";
import { rulesTable } from "../db/schema";
import { eq, and } from "drizzle-orm"; //

async function getRulesByUser(userId: number) {
  const urls = await db
    .select()
    .from(rulesTable)
    .where(eq(rulesTable.user_id, userId));
  return urls;
}

async function createRule(
  userId: number,
  endpoint: string,
  dataSchema: Record<string, string>,
  url_id?: number,
) {
  const values: any = {
    user_id: userId,
    endpoint: endpoint,
    dataSchema: dataSchema,
  };

  if (url_id !== undefined) {
    values.url_id = url_id;
  }
  const rule = await db.insert(rulesTable).values(values).returning();
  return rule;
}

async function bindUrlToRule(ruleId: number, urlId: number) {
  const updated = await db
    .update(rulesTable)
    .set({ url_id: urlId })
    .where(eq(rulesTable.id, ruleId))
    .returning();

  return updated;
}

async function getEndpoint(userId: number, ruleId: number) {
  const data = await db
    .select({ endpoint: rulesTable.endpoint })
    .from(rulesTable)
    .where(and(eq(rulesTable.user_id, userId), eq(rulesTable.id, ruleId)));

  return data[0]?.endpoint;
}
export { getRulesByUser, createRule, getEndpoint, bindUrlToRule };
