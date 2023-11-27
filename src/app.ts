import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewears/globalErrorHandler";
import { authRoutes } from "./modules/auth/authRoutes";

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Worlds!");
});

// error handler
app.use(globalErrorHandler);

export default app;
