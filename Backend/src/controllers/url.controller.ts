import { Request, Response } from "express";
import createDynamicUrlService from "../service/createDynamicUrlService";
import getDynamicUrlService from "../service/getDynamicUrlService";

async function createUrlRoute(req: Request, res: Response) {
  const userId = Number(req.user?.id);

  const url = await createDynamicUrlService(userId, req.params);
  res.status(201).json(url);
}

async function getUrlRoute(req: Request, res: Response) {
  const userId = Number(req.user?.id);

  const urls = await getDynamicUrlService(userId);
  res.status(200).json(urls);
}

export { createUrlRoute, getUrlRoute };
