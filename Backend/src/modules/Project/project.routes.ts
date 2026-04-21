import { Router } from "express";
import * as controller from "./project.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/", controller.createProject);
router.get("/", controller.getProjects);
router.get("/:projectId", controller.getProjectById);
router.patch("/:projectId", controller.updateProject);
router.delete("/:projectId", controller.deleteProject);

export default router;
