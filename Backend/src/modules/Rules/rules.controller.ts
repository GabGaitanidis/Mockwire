import { Request, Response } from "express";
import getRulesService from "./getRules.service";
import createRuleService from "./createRule.service";
import updateRuleService from "./updateRule.service";
import deleteRuleService from "./deleteRule.service";

async function getRulesController(req: Request, res: Response) {
  const rules = await getRulesService(req.user?.id, req.params.projectId);
  return res.status(200).json({
    message: "Rules fetched successfully",
    rules,
  });
}

async function createRulesController(req: Request, res: Response) {
  const result = await createRuleService(
    req.user?.id,
    req.params.projectId,
    req.body,
  );

  return res.status(201).json({
    message: "Rule created successfully",
    rule: result.rule,
  });
}

async function updateRulesController(req: Request, res: Response) {
  const rule = await updateRuleService(
    req.user?.id,
    req.params.projectId,
    req.params.id,
    req.params.version,
    req.body,
  );

  return res.status(200).json({
    message: "Rule updated successfully",
    rule,
  });
}

async function deleteRulesController(req: Request, res: Response) {
  const deletedRule = await deleteRuleService(
    req.user?.id,
    req.params.projectId,
    req.params.id,
  );

  return res.status(200).json({
    message: "Rule deleted successfully",
    deletedRule,
  });
}

export {
  getRulesController,
  createRulesController,
  updateRulesController,
  deleteRulesController,
};
