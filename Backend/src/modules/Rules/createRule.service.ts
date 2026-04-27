import { getUsersAPIKey } from "../Auth/auth.repo";
import { createRule } from "./rules.repo";
import { validateCreateRule } from "./rule.validation";
import { AppError } from "../../errors/AppError";
import normalizeEndpoint from "../../utils/normalizeEndpoint";

function parseUserId(userId: unknown) {
  const parsed = Number(userId);

  if (!parsed || Number.isNaN(parsed)) {
    throw new AppError("Unauthorized", 401);
  }

  return parsed;
}

function parseProjectId(projectId: unknown) {
  const parsed = Number(projectId);

  if (!parsed || Number.isNaN(parsed)) {
    throw new AppError("Invalid project id", 400);
  }

  return parsed;
}

async function createRuleService(
  userId: unknown,
  projectId: unknown,
  body: unknown,
) {
  const parsedUserId = parseUserId(userId);
  const parsedProjectId = parseProjectId(projectId);
  const { endpoint, dataSchema, latency, statusCodes } =
    validateCreateRule(body);
  const apiKey = await getUsersAPIKey(parsedUserId);

  if (!apiKey) {
    throw new AppError("API key not found for user", 404);
  }
  const cleanEndpoint = normalizeEndpoint(endpoint);
  const rule = await createRule(
    parsedUserId,
    parsedProjectId,
    cleanEndpoint,
    dataSchema ?? {},
    apiKey,
    latency,
    statusCodes,
  );

  return { rule };
}

export default createRuleService;
