import { Request, Response } from "express";
import { getRulesByUser } from "./rules.repo";
import createRuleService from "./createRule.service";
import updateRuleService from "./updateRule.service";
import deleteRuleService from "./deleteRule.service";
import { AppError } from "../../errors/AppError";

async function getRulesController(req: Request, res: Response) {
  const userId = Number(req.user?.id);

  const rules = await getRulesByUser(userId);
  return res.status(200).json({
    message: "Rules fetched successfully",
    rules,
  });
}

async function createRulesController(req: Request, res: Response) {
  const userId = Number(req.user?.id);

  const result = await createRuleService(userId, req.body);

  return res.status(201).json({
    message: "Rule created successfully",
    rule: result.rule,
  });
}

async function updateRulesController(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  const ruleId = Number(req.params.id);

  if (!ruleId || Number.isNaN(ruleId)) {
    throw new AppError("Invalid rule id", 400);
  }

  const rule = await updateRuleService(userId, ruleId, req.body);

  return res.status(200).json({
    message: "Rule updated successfully",
    rule,
  });
}

async function deleteRulesController(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  const ruleId = Number(req.params.id);

  if (!ruleId || Number.isNaN(ruleId)) {
    throw new AppError("Invalid rule id", 400);
  }

  const deletedRule = await deleteRuleService(userId, ruleId);

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
