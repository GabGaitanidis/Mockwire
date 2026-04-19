import { Request, Response } from "express";
import createUserService from "./createUser.service";
import { getUsers } from "./user.repo";
import updateUserService from "./updateUser.service";
import deleteUserService from "./deleteUser.service";
import { AppError } from "../../errors/AppError";

async function getUsersController(req: Request, res: Response) {
  const users = await getUsers();

  res.status(200).json({
    message: "Users fetched successfully",
    users,
  });
}

async function createUserController(req: Request, res: Response) {
  const user = await createUserService(
    req.body.name,
    req.body.email,
    req.body.password,
  );

  res.status(201).json({
    message: "User created successfully",
    user,
  });
}

async function updateUserController(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const targetUserId = Number(req.params.id);
  if (!targetUserId || Number.isNaN(targetUserId)) {
    throw new AppError("Invalid user id", 400);
  }

  const user = await updateUserService(req.user, targetUserId, req.body);

  res.status(200).json({
    message: "User updated successfully",
    user,
  });
}

async function deleteUserController(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const targetUserId = Number(req.params.id);
  if (!targetUserId || Number.isNaN(targetUserId)) {
    throw new AppError("Invalid user id", 400);
  }

  const deletedUser = await deleteUserService(req.user, targetUserId);

  res.status(200).json({
    message: "User deleted successfully",
    deletedUser,
  });
}

export {
  createUserController,
  getUsersController,
  updateUserController,
  deleteUserController,
};
