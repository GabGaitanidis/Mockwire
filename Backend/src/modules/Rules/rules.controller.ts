import { Request, Response } from "express";
import { getRulesByUser } from "./rules.repo";
import createRuleService from "./createRule.service";

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

export { getRulesController, createRulesController };
