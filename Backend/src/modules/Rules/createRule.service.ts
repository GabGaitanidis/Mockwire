import { getUsersAPIKey } from "../User/user.repo";
import { createRule } from "./rules.repo";
import { validateCreateRule } from "./rule.validation";

// createRule.service.ts
async function createRuleService(userId: number, body: any) {
  const { endpoint, dataSchema, latency, errorRate, statusCodes } =
    validateCreateRule(body);
  const apiKey = await getUsersAPIKey(userId);

  // We deleted the transformedStatusCodes block entirely

  const rule = await createRule(
    userId,
    endpoint,
    dataSchema,
    apiKey,
    latency,
    errorRate,
    statusCodes, // Pass the full object down!
  );

  return { rule };
}

export default createRuleService;
