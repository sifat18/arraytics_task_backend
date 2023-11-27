import express from "express";
import { getAllUser } from "./userController";
import auth from "../../shared/auth";

const router = express.Router();

router.get(
  "/users",
  //   auth('admin'),
  getAllUser
);

export const UserRoutes = router;
