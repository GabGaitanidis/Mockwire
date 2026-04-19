import { AppError } from "../../errors/AppError";
import { deleteUrlsByRuleId } from "../URL/url.repo";
import { deleteRuleById } from "./rules.repo";

async function deleteRuleService(userId: number, ruleId: number) {
  await deleteUrlsByRuleId(userId, ruleId);
  const deletedRule = await deleteRuleById(userId, ruleId);

  if (!deletedRule) {
    throw new AppError("Rule not found", 404);
  }

  return deletedRule;
}

export default deleteRuleService;
