import { AppError } from "../../errors/AppError";
import { validateUpdateRule } from "./rule.validation";
import { updateRuleById } from "./rules.repo";
import { updateVersion } from "./updateVersion";

async function updateRuleService(
  userId: unknown,
  projectId: unknown,
  ruleId: unknown,
  version: unknown,
  body: unknown,
) {
  const parsedUserId = Number(userId);
  const parsedProjectId = Number(projectId);
  const parsedRuleId = Number(ruleId);

  if (!parsedUserId || Number.isNaN(parsedUserId)) {
    throw new AppError("Unauthorized", 401);
  }

  if (!parsedProjectId || Number.isNaN(parsedProjectId)) {
    throw new AppError("Invalid project id", 400);
  }

  if (!parsedRuleId || Number.isNaN(parsedRuleId)) {
    throw new AppError("Invalid rule id", 400);
  }

  if (!version || typeof version !== "string") {
    throw new AppError("Invalid rule version", 400);
  }

  const payload = validateUpdateRule(body);
  const newVersion = updateVersion(version);

  const updatedRule = await updateRuleById(
    parsedUserId,
    parsedProjectId,
    parsedRuleId,
    {
      ...payload,
      version: newVersion,
    },
  );

  if (!updatedRule) {
    throw new AppError("Rule not found", 404);
  }

  return updatedRule;
}

export default updateRuleService;
