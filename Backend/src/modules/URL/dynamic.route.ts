import express from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import {
  createUrlRoute,
  deleteUrlRoute,
  getUrlRoute,
  updateUrlRoute,
} from "./url.controller";
import { getDynamicUrlData } from "./dynamicUrl.controller";
import checkUserId from "../../middlewares/checkUserId";

const dynamicRouter = express.Router();

dynamicRouter.get("/", requireAuth, checkUserId, getUrlRoute);
dynamicRouter.post("/:ruleId", requireAuth, checkUserId, createUrlRoute);
dynamicRouter.patch("/:id", requireAuth, checkUserId, updateUrlRoute);
dynamicRouter.delete("/:id", requireAuth, checkUserId, deleteUrlRoute);
dynamicRouter.get("/api/mock/:apiKey/:endpoint", getDynamicUrlData);

export default dynamicRouter;
