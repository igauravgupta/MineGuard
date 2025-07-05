import APIError from "../utils/apiError.js";
import asynchandler from "./asynchandler.middleware.js";
import jwt from "jsonwebtoken";

const auth = asynchandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  let isValid;
  try {
    if (!token) {
      throw new APIError("No token provided", 401);
    }
    if (token === "null") {
      throw new APIError("No token provided", 401);
    }
    if (token === "undefined") {
      throw new APIError("No token provided", 401);
    }
    isValid = await jwt.verify(token, process.env.ACCESSTOKENKEY);
  } catch (error) {
    console.log(error);
    throw new APIError("session expired", 404);
  }
  req.users = isValid;
  
  next();
});

export { auth };
