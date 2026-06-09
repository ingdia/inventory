import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getMedicines, getMedicineById } from "./medicine.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getMedicines);
router.get("/:id", getMedicineById);

export default router;
