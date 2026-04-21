import { AppError } from "../../errors/AppError";
import { updateUrlBodySchema, updateUrlParamsSchema } from "./url.validation";
import { updateDynamicUrlById } from "./url.repo";

async function updateDynamicUrlService(
  userId: number,
  projectId: number,
  params: object,
  body: object,
) {
  const parsedParams = updateUrlParamsSchema.parse(params);
  const parsedBody = updateUrlBodySchema.parse(body);

  const updatedUrl = await updateDynamicUrlById(
    userId,
    projectId,
    parsedParams.id,
    parsedBody.url,
  );

  if (!updatedUrl) {
    throw new AppError("Dynamic URL not found", 404);
  }

  return updatedUrl;
}

export default updateDynamicUrlService;
