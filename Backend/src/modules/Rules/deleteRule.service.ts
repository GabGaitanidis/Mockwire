import { AppError } from "../../errors/AppError";
import { deleteRuleById } from "./rules.repo";

async function deleteRuleService(userId: number, ruleId: number) {
  const deletedRule = await deleteRuleById(userId, ruleId);

  if (!deletedRule) {
    throw new AppError("Rule not found", 404);
  }

  return deletedRule;
}

export default deleteRuleService;
