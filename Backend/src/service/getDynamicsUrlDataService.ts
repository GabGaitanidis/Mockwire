import dataGenerator from "../data_generation/dataGenerator";
import { getDynamicsUrlData } from "../repository/dynamicUrl.repo";
import authorizeAPIKey from "./authorizeAPIKey";
import normalizeEndpoint from "./normalizeEndpoint";

async function getDynamicsUrlDataService(
  userId: number,
  apiKey: string,
  endpoint: string,
) {
  const normalizedEndpoint = normalizeEndpoint(endpoint);

  const access = await authorizeAPIKey(apiKey, normalizedEndpoint);

  if (!access) return false;

  const result = await getDynamicsUrlData(userId, normalizedEndpoint);
  if (!result || !result.length) {
    return null;
  }

  const schema = result[0].dataSchema;
  if (!schema || typeof schema !== "object") {
    return null;
  }

  return dataGenerator(schema);
}

export default getDynamicsUrlDataService;
