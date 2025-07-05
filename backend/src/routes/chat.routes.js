import { Router } from "express";
import { getAllChats, createChat, deleteChat } from "../controllers/chats.controllers.js";
import { auth as authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();    

// routes
router.route("/chats").get(authMiddleware, getAllChats).post(authMiddleware, createChat);
router.route("/:chatId").delete(authMiddleware, deleteChat);

export default router;