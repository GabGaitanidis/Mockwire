import type { Request, Response } from "express";
import { validateDynamicApi } from "../validation/dynamicUrlValidation";
import getDynamicsUrlDataService from "../service/getDynamicsUrlDataService";

function extractDynamicUrlParams(req: Request): {
  apiKey: string;
  endpoint: string;
} {
  const apiKeyParam = req.params.apiKey;
  const endpointEncoded = req.params.endpoint;

  if (!apiKeyParam || !endpointEncoded) {
    const error = new Error("Invalid API key or endpoint");
    (error as any).statusCode = 400;
    throw error;
  }

  let endpointParam = endpointEncoded;

  endpointParam = decodeURIComponent(endpointEncoded as string);

  return {
    apiKey: apiKeyParam as string,
    endpoint: endpointParam,
  };
}

async function getDynamicUrlData(req: Request, res: Response) {
  const userId = Number(req.user?.id);

  const rawParams = extractDynamicUrlParams(req);

  const { apiKey, endpoint } = validateDynamicApi(rawParams);

  const mockData = await getDynamicsUrlDataService(userId, apiKey, endpoint);

  if (!mockData) {
    return res.status(404).json({ message: "No data for this" });
  }

  return res.status(200).json(mockData);
}

export { getDynamicUrlData };
