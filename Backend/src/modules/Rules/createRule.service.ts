import { getUsersAPIKey } from "../Auth/auth.repo";
import { createRule } from "./rules.repo";
import { validateCreateRule } from "./rule.validation";
import { AppError } from "../../errors/AppError";

async function createRuleService(userId: number, projectId: number, body: any) {
  const { endpoint, dataSchema, latency, statusCodes } =
    validateCreateRule(body);
  const apiKey = await getUsersAPIKey(userId);

  if (!apiKey) {
    throw new AppError("API key not found for user", 404);
  }

  const rule = await createRule(
    userId,
    projectId,
    endpoint,
    dataSchema ?? {},
    apiKey,
    latency,
    statusCodes,
  );

  return { rule };
}

export default createRuleService;
