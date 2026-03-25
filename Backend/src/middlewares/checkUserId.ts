import { NextFunction, Request, Response } from "express";

function checkUserId(req: Request, res: Response, next: NextFunction) {
  const userId = Number(req.user?.id);

  if (!userId || Number.isNaN(userId)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export default checkUserId;
