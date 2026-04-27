import { Request, Response, NextFunction } from "express";
import { setAuthCookies, clearAuthCookies } from "../../utils/authCookies";

import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  getMeUser,
} from "./auth.service";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await registerUser(req.body);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.setHeader("x-api-key", result.user.api_key);

    return res.status(201).json({
      message: "User registered successfully",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.setHeader("x-api-key", result.user.api_key);

    return res.status(200).json({
      message: "Logged in successfully",
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await refreshSession(req.cookies?.refreshToken);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    return res.status(200).json({
      message: "Tokens refreshed",
      action: "refresh",
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await logoutUser(req.cookies?.refreshToken);
    clearAuthCookies(res);

    return res.status(200).json({
      message: "Logged out successfully",
      action: "logout",
    });
  } catch (error) {
    clearAuthCookies(res);
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getMeUser(req.user?.id);

    return res.status(200).json({
      message: "Authenticated user",
      user,
    });
  } catch (error) {
    next(error);
  }
}
