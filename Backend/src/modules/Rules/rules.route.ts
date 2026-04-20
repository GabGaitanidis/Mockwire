import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware";

import {
  createRulesController,
  deleteRulesController,
  getRulesController,
  updateRulesController,
} from "./rules.controller";
import checkUserId from "../../middlewares/checkUserId";
const ruleRouter = express.Router();

ruleRouter.get("/", requireAuth, checkUserId, getRulesController);
ruleRouter.post("/", requireAuth, checkUserId, createRulesController);
ruleRouter.patch(
  "/:version/:id",
  requireAuth,
  checkUserId,
  updateRulesController,
);
ruleRouter.delete("/:id", requireAuth, checkUserId, deleteRulesController);
export default ruleRouter;
