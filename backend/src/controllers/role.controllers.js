import Role from "../models/role.model.js";
import asyncHandler from "../middlewares/asynchandler.middleware.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";

// create Role 
const createRole = asyncHandler(async (req, res) => {
    const { roleName, permissions, description } = req.body;
    const role = await Role.create({ roleName, permissions, description });
    return res.status(200).json(new APIResponse(200, "Role created successfully!", role));
});

// delete Role
const deleteRole = asyncHandler(async (req, res) => {
    const { roleId } = req.params;
    const role = await Role.findByIdAndDelete(roleId);
    if (!role) {
        throw new APIError("Role not found!", 404);
    }
    return res.status(200).json(new APIResponse(200, "Role deleted successfully!", role));
});

// get all roles
const getAllRoles = asyncHandler(async (req, res) => {
    const roles = await Role.find();
    return res.status(200).json(new APIResponse(200, "Roles fetched successfully!", roles));
});

export { createRole, deleteRole,getAllRoles };