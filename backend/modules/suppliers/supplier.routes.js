import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getSuppliers, getSupplierById } from "./supplier.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getSuppliers);
router.get("/:id", getSupplierById);

export default router;
