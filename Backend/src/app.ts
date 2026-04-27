import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import urlRouter from "./modules/Rules/rules.route";
import dynamicRouter from "./modules/URL/dynamic.route";
import projectRouter from "./modules/Project/project.routes";
import conditionRouter from "./modules/ConditionSets/condition.routes";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";
import authRouter from "./modules/Auth/auth.routes";
import { globalLimiter, apiKeyLimiter, authLimiter } from "./utils/limiters";

const app = express();

function isAllowedOrigin(origin?: string) {
  if (!origin) return true;

  const allowedOrigins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://api-generator-eight.vercel.app",
  ];

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  if (origin.endsWith(".vercel.app")) {
    return true;
  }

  return false;
}

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use(globalLimiter);
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);
app.use("/auth/refresh", authLimiter);
app.use("/dynamics/api/mock", apiKeyLimiter);

app.use("/auth", authRouter);
app.use("/projects", projectRouter);
app.use("/projects/:projectId/condition-sets", conditionRouter);
app.use("/projects/:projectId/rules", urlRouter);
app.use("/projects/:projectId/urls", dynamicRouter);
app.use("/dynamics", dynamicRouter);
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Health check successful",
    status: "ok",
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
