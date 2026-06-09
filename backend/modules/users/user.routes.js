import { Router } from "express";
import { authenticate, authorizeRoles } from "../../middleware/auth.middleware.js";
import {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
  activateUser,
  updateProfile,
} from "./user.controller.js";

const router = Router();

router.use(authenticate);

router.patch("/profile", updateProfile);
router.get("/", authorizeRoles("owner"), getUsers);
router.post("/", authorizeRoles("owner"), createUser);
router.patch("/:id", authorizeRoles("owner"), updateUser);
router.delete("/:id", authorizeRoles("owner"), deactivateUser);
router.patch("/:id/activate", authorizeRoles("owner"), activateUser);

export default router;
