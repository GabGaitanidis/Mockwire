import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { rulesTable, userTable } from "../../db/schema";
import authorizeAPIKey from "../Auth/authorizeAPIKey";

async function getDynamicsUrlData(apiKey: string, endpoint: string) {
  const result = await db
    .select({
      user_id: rulesTable.user_id,
      project_id: rulesTable.project_id,
      version: rulesTable.version,
      dataSchema: rulesTable.dataSchema,
      latency: rulesTable.latency,
      errorRate: rulesTable.errorRate,
      statusCodes: rulesTable.statusCodes,
    })
    .from(rulesTable)
    .where(
      and(eq(rulesTable.api_key, apiKey), eq(rulesTable.endpoint, endpoint)),
    )
    .orderBy(desc(rulesTable.id))
    .limit(1);

  return result[0] ?? null;
}

export { authorizeAPIKey, getDynamicsUrlData };
