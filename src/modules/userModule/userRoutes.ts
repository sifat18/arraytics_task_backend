import express from "express";
import { getAllUser, updateUser, deleteUser } from "./userController";
import auth from "../../shared/auth";

const router = express.Router();

router.get(
  "/users",
  //   auth('admin'),
  getAllUser
);
router.patch(
  "/users/:id",
  //   auth('admin'),
  updateUser
);
router.delete(
  "/users/:id",
  //   auth('admin'),
  deleteUser
);

export const UserRoutes = router;
