import express from "express";
import {
  createOrder,
  deleteService,
  getAllOrders,
  updateOrder,
} from "./orderController";
import auth from "../../shared/auth";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", auth("client", "admin"), getAllOrders);
router.delete("/orders/:id", auth("client", "admin"), deleteService);
router.patch("/orders/:id", auth("client", "admin"), updateOrder);
export const orderRoutes = router;
