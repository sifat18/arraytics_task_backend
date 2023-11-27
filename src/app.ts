import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewears/globalErrorHandler";
import { authRoutes } from "./modules/auth/authRoutes";
import { UserRoutes } from "./modules/userModule/userRoutes";
import { ItemRoutes } from "./modules/item/itemRoutes";

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", authRoutes);
app.use("/api/v1", UserRoutes);
app.use("/api/v1", ItemRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Worlds!");
});

// error handler
app.use(globalErrorHandler);

export default app;
