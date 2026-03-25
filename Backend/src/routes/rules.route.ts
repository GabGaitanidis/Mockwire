import express from "express";
import { requireAuth } from "../middlewares/auth.middleware";

import {
  getRulesController,
  createRulesController,
} from "../controllers/rules.controller";
import checkUserId from "../middlewares/checkUserId";
const ruleRouter = express.Router();

ruleRouter.get("/", requireAuth, checkUserId, getRulesController);
ruleRouter.post("/", requireAuth, checkUserId, createRulesController);
export default ruleRouter;
