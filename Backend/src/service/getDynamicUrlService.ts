import { getDynamicUrl } from "../repository/url.repo";

async function getDynamicUrlService(userId: number) {
  const url = await getDynamicUrl(userId);
  if (!url) {
    throw new Error("No url found");
  }
  const urlString = url.map((u) => u.url);
  return urlString;
}

export default getDynamicUrlService;
