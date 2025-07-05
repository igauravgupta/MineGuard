import ChatDetails from "../models/chatDetails.model.js";
import asyncHandler from "../middlewares/asynchandler.middleware.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";


// Retrieve chat details by chatId
const getChatDetails = asyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    const chatDetails = await ChatDetails.find({ chatId });
    if (!chatDetails.length) {
        throw new APIError("Chat details not found!", 404);
     }
     return res.status(200).json(new APIResponse(200, "Chat details fetched successfully!", chatDetails));
});

// Save new chat details
const saveChatDetails = asyncHandler(async (req, res) => {
  const { chatId, userReq, botRes } = req.body;

  if (!chatId || !userReq || !botRes) {
    throw new APIError("Missing required fields!", 400);
  }

  const newChatDetail = await ChatDetails.create({
    chatId,
    req: userReq,
    res: botRes
  });
  return res.status(200).json(new APIResponse(200, "Chat details saved successfully!", newChatDetail));
});

// delete a chat
const deleteChatDetails = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const chat = await ChatDetails.findByIdAndDelete(chatId);
  if (!chat) {
    throw new APIError("Chat details not found!", 404);
  }
  return res.status(200).json(new APIResponse(200, "Chat details deleted successfully!", chat));
});

export { getChatDetails, saveChatDetails, deleteChatDetails };