import { Request, Response } from "express";
import createDynamicUrlService from "./createDynamicUrl.service";
import getDynamicUrlService from "./getDynamicUrl.service";

async function createUrlRoute(req: Request, res: Response) {
  const userId = Number(req.user?.id);

  const url = await createDynamicUrlService(userId, req.params);
  res.status(201).json({
    message: "Dynamic URL created successfully",
    url,
  });
}

async function getUrlRoute(req: Request, res: Response) {
  const userId = Number(req.user?.id);

  const urls = await getDynamicUrlService(userId);
  res.status(200).json({
    message: "Dynamic URLs fetched successfully",
    urls,
  });
}

export { createUrlRoute, getUrlRoute };
