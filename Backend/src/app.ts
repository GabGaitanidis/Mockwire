import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import urlRouter from "./modules/Rules/rules.route";
import dynamicRouter from "./modules/URL/dynamic.route";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";
import authRouter from "./modules/Auth/auth.routes";

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
    origin: (origin, callback) => {
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
app.use("/auth", authRouter);
app.use("/rules", urlRouter);
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
