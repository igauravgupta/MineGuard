import incidentTypeModel from "../models/incidentType.model.js";
import asyncHandler from "../middlewares/asynchandler.middleware.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";

// create incident type 
const createIncidentType = asyncHandler(async (req, res) => {
    const { IncidentType, description } = req.body;
    const incident = await incidentTypeModel.create({ IncidentType, description });
    return res.status(200).json(new APIResponse(200, "Incident type created successfully!", incident));
});


// delte incident type
const deleteIncidentType = asyncHandler(async (req, res) => {
    const { incidentTypeId } = req.params;
    const incident = await incidentTypeModel.findByIdAndDelete(incidentTypeId);
    if (!incident) {
        throw new APIError("Incident type not found!", 404);
    }
    return res.status(200).json(new APIResponse(200, "Incident type deleted successfully!", incident));
});

// get all incident types
const getIncidentTypes = asyncHandler(async (req, res) => {
    console.log("Fetching incident types...");
    const incidentTypes = await incidentTypeModel.find();
    return res.status(200).json(new APIResponse(200, "Incident types fetched successfully!", incidentTypes));
});

export { createIncidentType, deleteIncidentType, getIncidentTypes };