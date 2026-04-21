import { Request, Response } from "express";
import createDynamicUrlService from "./createDynamicUrl.service";
import getDynamicUrlService from "./getDynamicUrl.service";
import updateDynamicUrlService from "./updateDynamicUrl.service";
import deleteDynamicUrlService from "./deleteDynamicUrl.service";
import { AppError } from "../../errors/AppError";

async function createUrlRoute(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  const projectId = Number(req.params.projectId);

  if (!projectId || Number.isNaN(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  const url = await createDynamicUrlService(userId, projectId, req.params);
  res.status(201).json({
    message: "Dynamic URL created successfully",
    url,
  });
}

async function getUrlRoute(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  const projectId = Number(req.params.projectId);

  if (!projectId || Number.isNaN(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  const urls = await getDynamicUrlService(userId, projectId);
  res.status(200).json({
    message: "Dynamic URLs fetched successfully",
    urls,
  });
}

async function updateUrlRoute(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  const projectId = Number(req.params.projectId);

  if (!projectId || Number.isNaN(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  const url = await updateDynamicUrlService(
    userId,
    projectId,
    req.params,
    req.body,
  );

  res.status(200).json({
    message: "Dynamic URL updated successfully",
    url,
  });
}

async function deleteUrlRoute(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  const projectId = Number(req.params.projectId);

  if (!projectId || Number.isNaN(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  const deletedUrl = await deleteDynamicUrlService(
    userId,
    projectId,
    req.params,
  );

  res.status(200).json({
    message: "Dynamic URL deleted successfully",
    deletedUrl,
  });
}

export { createUrlRoute, getUrlRoute, updateUrlRoute, deleteUrlRoute };
