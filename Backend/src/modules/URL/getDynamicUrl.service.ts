import { getDynamicUrl } from "./url.repo";

async function getDynamicUrlService(userId: number) {
  const urls = await getDynamicUrl(userId);

  return urls ?? [];
}

export default getDynamicUrlService;
