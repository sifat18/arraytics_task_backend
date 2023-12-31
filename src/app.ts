import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewears/globalErrorHandler";
import { authRoutes } from "./modules/auth/authRoutes";
import { UserRoutes } from "./modules/userModule/userRoutes";
import { ItemRoutes } from "./modules/item/itemRoutes";
import { orderRoutes } from "./modules/booking/orderRoute";

const app: Application = express();
const options = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
};
app.use(cors(options));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", authRoutes);
app.use("/api/v1", UserRoutes);
app.use("/api/v1", ItemRoutes);
app.use("/api/v1", orderRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Worlds!");
});

// error handler
app.use(globalErrorHandler);

export default app;
