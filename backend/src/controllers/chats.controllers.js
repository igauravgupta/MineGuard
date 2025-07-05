import Chat from "../models/chat.model.js";
import asyncHandler from "../middlewares/asynchandler.middleware.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";

// Get all chats for the authenticated user
const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ userId: req.user._id });
  return res.status(200).json(new APIResponse(200, "Chats fetched successfully!", chats));
});

// Create a new chat
const createChat = asyncHandler(async (req, res) => {
  const { chatName } = req.body;
  if (!chatName) {
    throw new APIError("Chat name is required!", 400);
  }
  const newChat = await Chat.create({ chatName, userId: req.user._id });
  return res.status(200).json(new APIResponse(200, "Chat created successfully!", newChat));
});


// delete a chat
const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const chat = await Chat.findByIdAndDelete(chatId);
  if (!chat) {
    throw new APIError("Chat not found!", 404);
  }
  return res.status(200).json(new APIResponse(200, "Chat deleted successfully!", chat));
});


export { getAllChats, createChat, deleteChat };