import { Request, Response } from "express";
import { getRulesByUser } from "./rules.repo";
import createRuleService from "./createRule.service";
import updateRuleService from "./updateRule.service";
import deleteRuleService from "./deleteRule.service";
import { AppError } from "../../errors/AppError";

async function getRulesController(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  const projectId = Number(req.params.projectId);

  if (!projectId || Number.isNaN(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  const rules = await getRulesByUser(userId, projectId);
  return res.status(200).json({
    message: "Rules fetched successfully",
    rules,
  });
}

async function createRulesController(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  const projectId = Number(req.params.projectId);

  if (!projectId || Number.isNaN(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  const result = await createRuleService(userId, projectId, req.body);

  return res.status(201).json({
    message: "Rule created successfully",
    rule: result.rule,
  });
}

async function updateRulesController(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  const projectId = Number(req.params.projectId);
  const ruleId = Number(req.params.id);
  const version = req.params.version;

  if (!projectId || Number.isNaN(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  if (!ruleId || Number.isNaN(ruleId)) {
    throw new AppError("Invalid rule id", 400);
  }

  if (!version || typeof version !== "string") {
    throw new AppError("Invalid rule version", 400);
  }

  const rule = await updateRuleService(
    userId,
    projectId,
    ruleId,
    version,
    req.body,
  );

  return res.status(200).json({
    message: "Rule updated successfully",
    rule,
  });
}

async function deleteRulesController(req: Request, res: Response) {
  const userId = Number(req.user?.id);
  const projectId = Number(req.params.projectId);
  const ruleId = Number(req.params.id);

  if (!projectId || Number.isNaN(projectId)) {
    throw new AppError("Invalid project id", 400);
  }

  if (!ruleId || Number.isNaN(ruleId)) {
    throw new AppError("Invalid rule id", 400);
  }

  const deletedRule = await deleteRuleService(userId, projectId, ruleId);

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
