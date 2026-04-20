import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import urlRouter from "./modules/Rules/rules.route";
import dynamicRouter from "./modules/URL/dynamic.route";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";
import authRouter from "./modules/Auth/auth.routes";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://api-generator-eight.vercel.app",
    ],
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
