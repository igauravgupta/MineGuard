import IncidentReporting from "../models/incidentReporting.model.js";
import IncidentType from "../models/incidentType.model.js";
import asyncHandler from "../middlewares/asynchandler.middleware.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";

// Create a new incident
const createIncident = asyncHandler(async (req, res) => {
  const { description, status, location, severity, incidentType } = req.body.data;
  const { _id } = req.users;
  const userId = _id;
  if (!description || !status || !location || !severity) {
    console.log(description, status, location, severity);
    throw new APIError("Missing required fields!", 400);
  }
  const typeOfIncident = await IncidentType.find({IncidentType:incidentType});
  if (!typeOfIncident) {
    throw new APIError("Invalid incident type!", 400);
  }
  const newIncident = await IncidentReporting.create({
    description,
    status,
    location,
    severity,
    incidentType : typeOfIncident._id,
    reportedBy: userId,
    reportedAt: new Date(),
  });

  return res.status(200).json(new APIResponse(200, "Incident created successfully!", newIncident));
});

// Mark incident as closed (Only Officer Role)
const closeIncident = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if the user is an officer
  if (req.user.role !== "officer") {
    throw new APIError("Unauthorized to close incidents!", 403);
  }

  const incident = await IncidentReporting.findById(id);

  if (!incident) {
    throw new APIError("Incident not found!", 404);
  }

  if (incident.status === "closed") {
    throw new APIError("Incident is already closed!", 400);
  }

  incident.status = "closed";
  incident.resolvedAt = new Date();
  await incident.save();

  return res.status(200).json(new APIResponse(200, "Incident closed successfully!", incident));
});

const getAllIncidents = asyncHandler(async (req, res) => {
  const incidents = await IncidentReporting.find().populate("incidentType");
  return res.status(200).json(new APIResponse(200, "All incidents fetched successfully!", incidents));
});



export { createIncident, closeIncident,getAllIncidents };