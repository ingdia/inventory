// backend/modules/purchases/purchase.routes.js
import { Router } from "express";
import {
  authenticate,
  authorizeRoles,
} from "../../middleware/auth.middleware.js";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  receivePurchase,
  cancelPurchase,
} from "./purchase.controller.js";
import { validatePurchase } from "./purchase.validation.js";

const router = Router();

router.use(authenticate);

router.get("/", getPurchases);
router.get("/:id", getPurchaseById);
router.post("/", validatePurchase, createPurchase);
router.put("/:id/receive", receivePurchase);
router.put("/:id/cancel", authorizeRoles("owner"), cancelPurchase);

export default router;
