import dataGenerator from "../../data_generation/dataGenerator";
import authorizeAPIKey from "../Auth/authorizeAPIKey";
import { getConditionSets } from "../ConditionSets/condition.repo";
import normalizeEndpoint from "../../utils/normalizeEndpoint";
import { getDynamicsUrlData } from "./dynamicUrl.repo";
import { validateDynamicApi } from "./dynamicUrl.validation";

async function getDynamicsUrlDataService(params: Object) {
  const { apiKey, endpoint } = validateDynamicApi(params);
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  const access = await authorizeAPIKey(apiKey, normalizedEndpoint);

  if (!access) return false;

  const result = await getDynamicsUrlData(apiKey, normalizedEndpoint);
  if (!result) {
    return null;
  }

  const schema = result.dataSchema;
  const latency = result.latency || 0;
  const statusCodes = result.statusCodes;
  const version = result.version;
  if (!schema || typeof schema !== "object") {
    return null;
  }

  const conditionSets = await getConditionSets(
    result.user_id,
    result.project_id,
  );
  const combinedConditions = [
    ...(Array.isArray(schema.conditions) ? schema.conditions : []),
    ...conditionSets.flatMap((conditionSet) =>
      Array.isArray(conditionSet.conditions) ? conditionSet.conditions : [],
    ),
  ];

  const mockSchema = {
    ...schema,
    conditions: combinedConditions,
  };

  const mockData = dataGenerator(mockSchema);
  return { mockData, latency, statusCodes, version };
}

export default getDynamicsUrlDataService;
