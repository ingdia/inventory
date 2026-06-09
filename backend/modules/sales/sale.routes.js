// backend/modules/sales/sale.routes.js
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import {
  createSale,
  getSales,
  getSaleById,
  getTodaySummary,
  getSummaryByRange,
} from "./sale.controller.js";
import { validateSale } from "./sale.validation.js";

const router = Router();

router.use(authenticate);

router.get("/summary/today", getTodaySummary);
router.get("/summary/range", getSummaryByRange);
router.get("/", getSales);
router.get("/:id", getSaleById);
router.post("/", validateSale, createSale);

export default router;
