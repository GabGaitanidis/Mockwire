import { getDynamicUrl } from "./url.repo";

async function getDynamicUrlService(userId: number, projectId: number) {
  const urls = await getDynamicUrl(userId, projectId);

  return urls ?? [];
}

export default getDynamicUrlService;
