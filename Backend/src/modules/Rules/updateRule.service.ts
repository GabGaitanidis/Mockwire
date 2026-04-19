import { AppError } from "../../errors/AppError";
import { validateUpdateRule } from "./rule.validation";
import { updateRuleById } from "./rules.repo";

async function updateRuleService(userId: number, ruleId: number, body: any) {
  const payload = validateUpdateRule(body);

  const updatedRule = await updateRuleById(userId, ruleId, payload);

  if (!updatedRule) {
    throw new AppError("Rule not found", 404);
  }

  return updatedRule;
}

export default updateRuleService;
