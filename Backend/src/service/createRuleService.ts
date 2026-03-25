import { createRule } from "../repository/rules.repo";
import { validateCreateRule } from "../validation/ruleValidation";

async function createRuleService(userId: number, body: any, url_id?: number) {
  const { endpoint, dataSchema } = validateCreateRule(body);

  const rule = await createRule(userId, endpoint, dataSchema, url_id);

  return { rule };
}

export default createRuleService;
