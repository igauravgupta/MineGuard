import { Router } from "express";
import {createIncidentType, deleteIncidentType,getIncidentTypes} from "../controllers/incidentType.controllers.js";
import { auth as authMiddleware } from "../middlewares/auth.middleware.js";
import  {isAdmin} from  "../middlewares/isAdmin.middleware.js";

const router = Router();

// routes
// router.route("/").post( createIncidentType);
router.route("/").post(authMiddleware, isAdmin, createIncidentType);

router.route("/").get(authMiddleware, isAdmin, getIncidentTypes);
router.route("/:incidentTypeId").delete(authMiddleware, isAdmin, deleteIncidentType);   

export default router;