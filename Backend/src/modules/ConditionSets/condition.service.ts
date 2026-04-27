import { AppError } from "../../errors/AppError";
import {
  createConditionSet,
  deleteConditionSet,
  getConditionSetById,
  getConditionSets,
  updateConditionSet,
} from "./condition.repo";

import {
  validateCreateConditionSet,
  validateUpdateConditionSet,
} from "./condition.validation";

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

function parseConditionSetId(id: unknown) {
  const parsed = Number(id);

  if (!parsed || Number.isNaN(parsed)) {
    throw new AppError("Invalid condition set id", 400);
  }

  return parsed;
}

export async function createConditionSetService(
  userId: unknown,
  projectId: unknown,
  body: unknown,
) {
  const parsedUserId = parseUserId(userId);
  const parsedProjectId = parseProjectId(projectId);

  const data = validateCreateConditionSet(body);
  return createConditionSet(parsedUserId, parsedProjectId, data);
}

export async function getConditionSetsService(
  userId: unknown,
  projectId: unknown,
) {
  const parsedUserId = parseUserId(userId);
  const parsedProjectId = parseProjectId(projectId);

  return getConditionSets(parsedUserId, parsedProjectId);
}

export async function getConditionSetByIdService(
  userId: unknown,
  projectId: unknown,
  id: unknown,
) {
  const parsedUserId = parseUserId(userId);
  const parsedProjectId = parseProjectId(projectId);
  const parsedId = parseConditionSetId(id);
  const conditionSet = await getConditionSetById(
    parsedUserId,
    parsedProjectId,
    parsedId,
  );

  if (!conditionSet) {
    throw new AppError("Condition set not found", 404);
  }

  return conditionSet;
}

export async function updateConditionSetService(
  userId: unknown,
  projectId: unknown,
  id: unknown,
  body: unknown,
) {
  const parsedUserId = parseUserId(userId);
  const parsedProjectId = parseProjectId(projectId);
  const parsedId = parseConditionSetId(id);

  const data = validateUpdateConditionSet(body);
  const conditionSet = await updateConditionSet(
    parsedUserId,
    parsedProjectId,
    parsedId,
    data,
  );

  if (!conditionSet) {
    throw new AppError("Condition set not found", 404);
  }

  return conditionSet;
}

export async function deleteConditionSetService(
  userId: unknown,
  projectId: unknown,
  id: unknown,
) {
  const parsedUserId = parseUserId(userId);
  const parsedProjectId = parseProjectId(projectId);
  const parsedId = parseConditionSetId(id);
  const conditionSet = await deleteConditionSet(
    parsedUserId,
    parsedProjectId,
    parsedId,
  );

  if (!conditionSet) {
    throw new AppError("Condition set not found", 404);
  }

  return conditionSet;
}
