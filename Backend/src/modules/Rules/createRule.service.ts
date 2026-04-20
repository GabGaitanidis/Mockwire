import { getUsersAPIKey } from "../Auth/auth.repo";
import { createRule } from "./rules.repo";
import { validateCreateRule } from "./rule.validation";

async function createRuleService(userId: number, body: any) {
  const { endpoint, dataSchema, latency, statusCodes } =
    validateCreateRule(body);
  const apiKey = await getUsersAPIKey(userId);

  const rule = await createRule(
    userId,
    endpoint,
    dataSchema,
    apiKey,
    latency,
    statusCodes,
  );

  return { rule };
}

export default createRuleService;
