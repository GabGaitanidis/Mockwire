import { AppError } from "../../errors/AppError";
import { validateUpdateRule } from "./rule.validation";
import { updateRuleById } from "./rules.repo";
import { updateVersion } from "./updateVersion";

async function updateRuleService(
  userId: number,
  projectId: number,
  ruleId: number,
  version: string,
  body: any,
) {
  const payload = validateUpdateRule(body);
  const newVersion = updateVersion(version);

  const updatedRule = await updateRuleById(userId, projectId, ruleId, {
    ...payload,
    version: newVersion,
  });

  if (!updatedRule) {
    throw new AppError("Rule not found", 404);
  }

  return updatedRule;
}

export default updateRuleService;
