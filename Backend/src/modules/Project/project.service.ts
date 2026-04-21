import * as repo from "./project.repo";

export const createProject = async (user_id: number, name: string) => {
  return repo.createProject({ user_id, name });
};

export const getProjects = async (user_id: number) => {
  return repo.getProjects(user_id);
};

export const getProjectById = async (user_id: number, id: number) => {
  return repo.getProjectById(user_id, id);
};

export const updateProject = async (
  user_id: number,
  id: number,
  name?: string,
) => {
  return repo.updateProject(user_id, id, { name });
};

export const deleteProject = async (user_id: number, id: number) => {
  return repo.deleteProject(user_id, id);
};
