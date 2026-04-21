import { Request, Response, NextFunction } from "express";
import * as service from "./project.service";
import { createProjectSchema, updateProjectSchema } from "./project.validation";
import { AppError } from "../../errors/AppError";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user_id = req.user.id;
    const { name } = createProjectSchema.parse(req.body);
    const project = await service.createProject(Number(user_id), name);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

export const getProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user_id = req.user.id;
    const projects = await service.getProjects(Number(user_id));
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user_id = Number(req.user.id);
    const id = Number(req.params.projectId);
    const project = await service.getProjectById(user_id, id);
    if (!project) throw new AppError("Project not found", 404);
    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user_id = Number(req.user.id);
    const id = Number(req.params.projectId);
    const { name } = updateProjectSchema.parse(req.body);
    const project = await service.updateProject(user_id, id, name);
    if (!project) throw new AppError("Project not found", 404);
    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user_id = Number(req.user.id);
    const id = Number(req.params.projectId);
    const project = await service.deleteProject(user_id, id);
    if (!project) throw new AppError("Project not found", 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
