import type { Request, Response } from "express";
import getDynamicsUrlDataService from "./getDynamicsUrlData.service";
import pickRandomStatusCode from "../../data_generation/statusCodePick";
import { AppError } from "../../errors/AppError";

async function getDynamicUrlData(req: Request, res: Response) {
  const apiKey = req.params["0"];
  const endpoint = req.params["1"];

  if (!apiKey || !endpoint) {
    throw new AppError("Invalid dynamic route parameters", 400);
  }

  const rawParams = {
    apiKey,
    endpoint,
  };
  const result = await getDynamicsUrlDataService(rawParams);

  if (!result) {
    throw new AppError("No data found for this endpoint", 404);
  }

  const { mockData, latency, statusCodes } = result;

  if (latency > 0) {
    console.log(latency);
    await new Promise((resolve) => setTimeout(resolve, latency));
  }

  const {
    error,
    code: statusCode,
    message: statusMessage,
  } = pickRandomStatusCode(statusCodes);
  console.log(statusCode);
  return res.status(statusCode).json({
    error,
    statusCode,
    message: statusMessage,
    latency,
    data: mockData,
  });
}

export { getDynamicUrlData };
