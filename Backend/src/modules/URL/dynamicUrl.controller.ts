import type { Request, Response } from "express";
import getDynamicsUrlDataService from "./getDynamicsUrlData.service";
import pickRandomStatusCode from "../../data_generation/statusCodePick";
import { AppError } from "../../errors/AppError";

async function getDynamicUrlData(req: Request, res: Response) {
  const rawParams = {
    apiKey: req.params.apiKey,
    endpoint: req.params.endpoint,
  };
  const result = await getDynamicsUrlDataService(rawParams);

  if (!result) {
    throw new AppError("No data found for this endpoint", 404);
  }

  const { mockData, latency, errorRate, statusCodes } = result;

  if (latency > 0) {
    await new Promise((resolve) => setTimeout(resolve, latency));
  }

  const { code: statusCode, message: statusMessage } =
    pickRandomStatusCode(statusCodes);

  return res.status(statusCode).json({
    statusCode,
    message: statusMessage,
    mockData,
    data: mockData,
  });
}

export { getDynamicUrlData };
