import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  createConditionSetController,
  deleteConditionSetController,
  getConditionSetByIdController,
  getConditionSetsController,
  updateConditionSetController,
} from "./condition.controller";

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", getConditionSetsController);
router.get("/:conditionSetId", getConditionSetByIdController);
router.post("/", createConditionSetController);
router.patch("/:conditionSetId", updateConditionSetController);
router.delete("/:conditionSetId", deleteConditionSetController);

export default router;
