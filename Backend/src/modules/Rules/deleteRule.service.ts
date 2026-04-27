import { AppError } from "../../errors/AppError";
import { deleteRuleById } from "./rules.repo";

async function deleteRuleService(
  userId: unknown,
  projectId: unknown,
  ruleId: unknown,
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

  const deletedRule = await deleteRuleById(
    parsedUserId,
    parsedProjectId,
    parsedRuleId,
  );

  if (!deletedRule) {
    throw new AppError("Rule not found", 404);
  }

  return deletedRule;
}

export default deleteRuleService;
