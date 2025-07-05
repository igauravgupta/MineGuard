import APIError from "../utils/apiError.js";
import Role from "../models/role.model.js";

const isAdmin = async(req, res, next) => {
    const role = await Role.findById(req.users.role);
    if (role.roleName != "Admin") {
        return new APIError("You are not authorized to perform this action!", 403);
    }
    next(); 
}

export {isAdmin};