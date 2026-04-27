import * as repo from "./project.repo";
import { createProjectSchema, updateProjectSchema } from "./project.validation";
import { AppError } from "../../errors/AppError";

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

export const createProject = async (user_id: unknown, body: unknown) => {
  const parsedUserId = parseUserId(user_id);
  const { name } = createProjectSchema.parse(body);
  return repo.createProject({ user_id: parsedUserId, name });
};

export const getProjects = async (user_id: unknown) => {
  const parsedUserId = parseUserId(user_id);
  return repo.getProjects(parsedUserId);
};

export const getProjectById = async (user_id: unknown, id: unknown) => {
  const parsedUserId = parseUserId(user_id);
  const parsedProjectId = parseProjectId(id);
  const project = await repo.getProjectById(parsedUserId, parsedProjectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

export const updateProject = async (
  user_id: unknown,
  id: unknown,
  body: unknown,
) => {
  const parsedUserId = parseUserId(user_id);
  const parsedProjectId = parseProjectId(id);
  const { name } = updateProjectSchema.parse(body);
  const project = await repo.updateProject(parsedUserId, parsedProjectId, {
    name,
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

export const deleteProject = async (user_id: unknown, id: unknown) => {
  const parsedUserId = parseUserId(user_id);
  const parsedProjectId = parseProjectId(id);
  const project = await repo.deleteProject(parsedUserId, parsedProjectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};
