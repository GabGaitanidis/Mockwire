import bcrypt from "bcrypt";
import { AppError } from "../../errors/AppError";
import { updateUserById } from "./user.repo";
import { validateUpdateUser } from "./user.validation";

async function updateUserService(
  actor: { id: string; role: string },
  targetUserId: number,
  body: unknown,
) {
  const isOwner = Number(actor.id) === targetUserId;
  const isAdmin = actor.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Forbidden", 403);
  }

  const parsedBody = validateUpdateUser(body);
  const dataToUpdate: { name?: string; email?: string; password?: string } = {
    name: parsedBody.name?.trim(),
    email: parsedBody.email?.trim(),
  };

  if (parsedBody.password) {
    dataToUpdate.password = await bcrypt.hash(parsedBody.password, 10);
  }

  const updatedUser = await updateUserById(targetUserId, dataToUpdate);

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  return updatedUser;
}

export default updateUserService;
