import { Request, Response, NextFunction } from "express";
import * as service from "./project.service";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const project = await service.createProject(req.user?.id, req.body);
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
    const projects = await service.getProjects(req.user?.id);
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
    const project = await service.getProjectById(
      req.user?.id,
      req.params.projectId,
    );
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
    const project = await service.updateProject(
      req.user?.id,
      req.params.projectId,
      req.body,
    );
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
    const project = await service.deleteProject(
      req.user?.id,
      req.params.projectId,
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
