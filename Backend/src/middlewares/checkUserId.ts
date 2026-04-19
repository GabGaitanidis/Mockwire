import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

function checkUserId(req: Request, res: Response, next: NextFunction) {
  const userId = Number(req.user?.id);

  if (!userId || Number.isNaN(userId)) {
    return next(new AppError("Unauthorized", 401));
  }
  next();
}

export default checkUserId;
