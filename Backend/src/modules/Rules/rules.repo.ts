import { db } from "../../db";
import { rulesTable } from "../../db/schema";
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
  apiKey: string,
  latency: number = 0,
  errorRate: number = 0,
  statusCodes: Record<string, { weight: number; message: string }>,
) {
  const values = {
    user_id: userId,
    endpoint,
    dataSchema,
    api_key: apiKey,
    latency,
    errorRate,
    statusCodes,
  };

  const rule = await db.insert(rulesTable).values(values).returning();
  return rule[0];
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
