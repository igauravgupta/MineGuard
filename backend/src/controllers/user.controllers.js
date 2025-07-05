import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asynchandler.middleware.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import Role from "../models/role.model.js";


// User Registration
const registerUser = asyncHandler(async (req, res) => {
  const {emailId, name, password ,role} = req.body;

  const existingUser = await User.findOne({ emailId});
  if (existingUser) {
    throw new APIError("User already exists!", 400);
  }
  const roleId = await Role.findOne({roleName:role});
  if (!roleId) {
    throw new APIError("Role not found!", 404);
  }
  const user = await User.create({ emailId, name, password, role: roleId._id });
  if (!user) {
    throw new APIError("User registration failed!", 500);
  }
  const token = user.generateAccessToken();
  return res.status(200).json(new APIResponse(200, "User registered successfully!", token));
});

// User Login
const loginUser = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;
  console.log(emailId, password);
  const user = await User.findOne({ emailId });
  if(!user){
    throw new APIError("User not found!", 404);
  }
  console.log(user);
  const match = await user.comparePassword(password);
  console.log("Password match:", match);
  if(!match){
    throw new APIError("Invalid credentials!", 401);    
  }
  const token = user.generateAccessToken();
  return res.status(200).json({ token });
});

// Get User Profile (Protected)
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ userId: req.user._id }).select("-password");
  if (!user) {
    throw new APIError("User not found!", 404);
  }
  return res.status(200).json(new APIResponse(200, "User profile fetched successfully!", user));
});

//update Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { emailId,name} = req.body;
  const user = await User.findOne({ userId: req.user._id });

  if (!user) {
    throw new APIError("User not found!", 404);
  }

  if (name) user.name = name;
  if(emailId) user.emailId = emailId;
  await user.save();
  return res.status(200).json(new APIResponse(200, "User profile updated successfully!", user));
});

//get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").populate("role", "roleName");
  if (!users) {
    throw new APIError("No users found!", 404);
  }
  return res.status(200).json(new APIResponse(200, "Users fetched successfully!", users));
});

// delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new APIError("User not found!", 404);
  }
  return res.status(200).json(new APIResponse(200, "User deleted successfully!", user));
});


export { registerUser, loginUser, getUserProfile, updateUserProfile,getAllUsers ,deleteUser};