import { Request, Response } from "express";
import createUserService from "./createUser.service";
import { getUsers } from "./user.repo";

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

export { createUserController, getUsersController };
