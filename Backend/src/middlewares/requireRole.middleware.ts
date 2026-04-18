import { Request, Response, NextFunction } from "express";

export function requireRole(req: Request, res: Response, next: NextFunction) {
  if (req.user.role == "admin") next();
  else return res.status(401).json({ message: "Unauthorized" });
}
