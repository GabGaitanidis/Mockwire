import { AppError } from "../../errors/AppError";
import { deleteUrlParamsSchema } from "./url.validation";
import { deleteDynamicUrlById } from "./url.repo";

async function deleteDynamicUrlService(userId: number, params: object) {
  const parsedParams = deleteUrlParamsSchema.parse(params);

  const deletedUrl = await deleteDynamicUrlById(userId, parsedParams.id);

  if (!deletedUrl) {
    throw new AppError("Dynamic URL not found", 404);
  }

  return deletedUrl;
}

export default deleteDynamicUrlService;
