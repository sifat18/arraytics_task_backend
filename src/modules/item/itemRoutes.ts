import express from "express";
import auth from "../../shared/auth";
import {
  deleteItem,
  getAllItems,
  updateItem,
  createItem,
} from "./itemController";

const router = express.Router();

router.post(
  "/create/items",
  //   auth('admin'),
  createItem
);
router.get(
  "/items",
  //   auth('admin'),
  getAllItems
);
router.patch(
  "/items/:id",
  //   auth('admin'),
  updateItem
);
router.delete(
  "/items/:id",
  //   auth('admin'),
  deleteItem
);

export const ItemRoutes = router;
