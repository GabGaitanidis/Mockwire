import { getEndpoint, bindUrlToRule } from "../repository/rules.repo";
import { getUsersAPIKey } from "../repository/user.repo";
import urlGenerator from "../data_generation/urlCreator";
import { createDynamicUrl } from "../repository/url.repo";
import { createUrlSchema } from "../validation/urlValidation";

async function createDynamicUrlService(userId: number, params: Object) {
  const validation = createUrlSchema.safeParse(params);
  if (!validation.success) {
    throw new Error(`Validation failed: ${validation.error.message}`);
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
