import express from "express";
import { createUser, loginUser } from "./authController";

const router = express.Router();

router.post("/auth/signup", createUser);
router.post("/auth/login", loginUser);
export const authRoutes = router;
