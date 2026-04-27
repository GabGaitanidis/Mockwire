import { Request, Response, NextFunction } from "express";
import {
  createConditionSetService,
  deleteConditionSetService,
  getConditionSetByIdService,
  getConditionSetsService,
  updateConditionSetService,
} from "./condition.service";

export async function createConditionSetController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const conditionSet = await createConditionSetService(
      req.user?.id,
      req.params.projectId,
      req.body,
    );

    res.status(201).json({
      message: "Condition set created successfully",
      conditionSet,
    });
  } catch (err) {
    next(err);
  }
}

export async function getConditionSetsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const conditionSets = await getConditionSetsService(
      req.user?.id,
      req.params.projectId,
    );

    res.status(200).json({
      message: "Condition sets fetched successfully",
      conditionSets,
    });
  } catch (err) {
    next(err);
  }
}

export async function getConditionSetByIdController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const conditionSet = await getConditionSetByIdService(
      req.user?.id,
      req.params.projectId,
      req.params.conditionSetId,
    );

    res.status(200).json({
      message: "Condition set fetched successfully",
      conditionSet,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateConditionSetController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const conditionSet = await updateConditionSetService(
      req.user?.id,
      req.params.projectId,
      req.params.conditionSetId,
      req.body,
    );

    res.status(200).json({
      message: "Condition set updated successfully",
      conditionSet,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteConditionSetController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const conditionSet = await deleteConditionSetService(
      req.user?.id,
      req.params.projectId,
      req.params.conditionSetId,
    );

    res.status(200).json({
      message: "Condition set deleted successfully",
      conditionSet,
    });
  } catch (err) {
    next(err);
  }
}
