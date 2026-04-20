import { getEndpoint, bindUrlToRule } from "../Rules/rules.repo";
import urlGenerator from "../../data_generation/urlCreator";
import { createDynamicUrl } from "./url.repo";
import { createUrlSchema } from "./url.validation";
import { getUsersAPIKey } from "../Auth/auth.repo";
import { AppError } from "../../errors/AppError";

async function createDynamicUrlService(userId: number, params: Object) {
  const validation = createUrlSchema.safeParse(params);
  if (!validation.success) {
    throw new AppError(`Validation failed: ${validation.error.message}`, 400);
  }
  const { ruleId } = validation.data;
  const apiKey = await getUsersAPIKey(userId);
  const endpoint = await getEndpoint(userId, ruleId);
  const urlString = urlGenerator(apiKey, endpoint);

  const createdUrl = await createDynamicUrl(userId, urlString, ruleId);

  if (createdUrl?.id) {
    await bindUrlToRule(ruleId, createdUrl.id);
  }

  return createdUrl;
}

export default createDynamicUrlService;
