import { AppError } from "../../errors/AppError";
import { deleteRuleById } from "./rules.repo";

async function deleteRuleService(
  userId: number,
  projectId: number,
  ruleId: number,
) {
  const deletedRule = await deleteRuleById(userId, projectId, ruleId);

  if (!deletedRule) {
    throw new AppError("Rule not found", 404);
  }

  return deletedRule;
}

export default deleteRuleService;
