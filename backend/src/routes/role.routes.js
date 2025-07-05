import { Router } from "express";
import { createRole, deleteRole,getAllRoles} from "../controllers/role.controllers.js";
import { auth as authMiddleware } from "../middlewares/auth.middleware.js";
import {isAdmin} from "../middlewares/isAdmin.middleware.js";

const router = Router();

// // routes
router.route("/").post(authMiddleware, isAdmin, createRole);
router.route("/").get(authMiddleware, isAdmin, getAllRoles);
router.route("/:roleId").delete(authMiddleware, isAdmin, deleteRole);

export default router;