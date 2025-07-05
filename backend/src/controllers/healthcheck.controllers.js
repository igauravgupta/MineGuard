import asynchandler from "../middlewares/asynchandler.middleware.js";
import APIResponse from "../utils/apiResponse.js";

export const heathcheck = asynchandler(async (req, res) => {
  res.status(200).json(new APIResponse(200, "test ok"));
});
