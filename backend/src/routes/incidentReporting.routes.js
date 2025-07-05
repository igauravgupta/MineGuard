import { Router } from "express";
import {createIncident, closeIncident,getAllIncidents} from "../controllers/incidentReporting.controllers.js";
import { auth as authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// routes
router.route("/").post(authMiddleware, createIncident);
router.route("/").get(authMiddleware, getAllIncidents);
router.route("/:id").put(authMiddleware, closeIncident);

export default router;