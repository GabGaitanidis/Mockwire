import { getEndpoint, bindUrlToRule } from "../Rules/rules.repo";
import urlGenerator from "../../data_generation/urlCreator";
import { createDynamicUrl } from "./url.repo";
import { createUrlSchema } from "./url.validation";
import { getUsersAPIKey } from "../Auth/auth.repo";
import { AppError } from "../../errors/AppError";

async function createDynamicUrlService(
  userId: number,
  projectId: number,
  params: object,
) {
  const validation = createUrlSchema.safeParse(params);
  if (!validation.success) {
    throw new AppError(`Validation failed: ${validation.error.message}`, 400);
  }
  const { ruleId } = validation.data;
  const apiKey = await getUsersAPIKey(userId);
  if (!apiKey) {
    throw new AppError("API key not found for user", 404);
  }
  const endpoint = await getEndpoint(userId, projectId, ruleId);

  if (!endpoint) {
    throw new AppError("Rule not found for this project", 404);
  }

  const urlString = urlGenerator(apiKey, endpoint);

  const createdUrl = await createDynamicUrl(
    userId,
    projectId,
    urlString,
    ruleId,
  );

  if (createdUrl?.id) {
    await bindUrlToRule(userId, projectId, ruleId, createdUrl.id);
  }

  return createdUrl;
}

export default createDynamicUrlService;
