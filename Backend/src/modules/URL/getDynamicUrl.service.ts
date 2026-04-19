import { getDynamicUrl } from "./url.repo";
import { AppError } from "../../errors/AppError";

async function getDynamicUrlService(userId: number) {
  const url = await getDynamicUrl(userId);
  if (!url || url.length === 0) {
    throw new AppError("No URLs found for this user", 404);
  }
  const urlString = url.map((u) => u.url);
  return urlString;
}

export default getDynamicUrlService;
