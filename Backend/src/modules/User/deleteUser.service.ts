import { AppError } from "../../errors/AppError";
import { deleteUrlsByUserId } from "../URL/url.repo";
import { deleteRulesByUserId } from "../Rules/rules.repo";
import { deleteUserById } from "./user.repo";

async function deleteUserService(
  actor: { id: string; role: string },
  targetUserId: number,
) {
  const isOwner = Number(actor.id) === targetUserId;
  const isAdmin = actor.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("Forbidden", 403);
  }

  await deleteUrlsByUserId(targetUserId);
  await deleteRulesByUserId(targetUserId);
  const deletedUser = await deleteUserById(targetUserId);

  if (!deletedUser) {
    throw new AppError("User not found", 404);
  }

  return deletedUser;
}

export default deleteUserService;
