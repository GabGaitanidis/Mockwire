import { AppError } from "../../errors/AppError";
import { getRulesByUser } from "./rules.repo";

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

async function getRulesService(userId: unknown, projectId: unknown) {
  const parsedUserId = parseUserId(userId);
  const parsedProjectId = parseProjectId(projectId);

  return getRulesByUser(parsedUserId, parsedProjectId);
}

export default getRulesService;
