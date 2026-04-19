import bcrypt from "bcrypt";
import { AppError } from "../../errors/AppError";
import { updateUserById } from "./user.repo";

async function updateUserService(
  actor: { id: string; role: string },
  targetUserId: number,
  body: { name?: string; email?: string; password?: string },
) {
  const isOwner = Number(actor.id) === targetUserId;
  const isAdmin = actor.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Forbidden", 403);
  }

  const dataToUpdate: { name?: string; email?: string; password?: string } = {};

  if (typeof body.name === "string" && body.name.trim()) {
    dataToUpdate.name = body.name.trim();
  }

  if (typeof body.email === "string" && body.email.trim()) {
    dataToUpdate.email = body.email.trim();
  }

  if (typeof body.password === "string" && body.password.trim()) {
    dataToUpdate.password = await bcrypt.hash(body.password, 10);
  }

  if (Object.keys(dataToUpdate).length === 0) {
    throw new AppError("No valid fields provided for update", 400);
  }

  const updatedUser = await updateUserById(targetUserId, dataToUpdate);

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return updatedUser;
}

export default updateUserService;
