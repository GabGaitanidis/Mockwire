import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function requireRole(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role === "admin") {
    return next();
  }

  return next(new AppError("Unauthorized", 401));
}
