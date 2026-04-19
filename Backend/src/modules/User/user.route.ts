import express from "express";
import {
  createUserController,
  deleteUserController,
  getUsersController,
  updateUserController,
} from "./user.controller";
import { requireAuth } from "../../middlewares/auth.middleware";
const userRouter = express.Router();

userRouter.get("/", getUsersController);
userRouter.post("/", createUserController);
userRouter.patch("/:id", requireAuth, updateUserController);
userRouter.delete("/:id", requireAuth, deleteUserController);

export default userRouter;
