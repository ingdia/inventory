import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  login,
  logout,
  refresh,
  getMe,
  updatePassword,
} from "./auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);
router.patch("/update-password", authenticate, updatePassword);

export default router;
