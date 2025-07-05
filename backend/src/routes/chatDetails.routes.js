import { Router } from "express";
import { getChatDetails , saveChatDetails, deleteChatDetails} from "../controllers/chatDetails.controllers.js";
import { auth as authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// routes
router.route("/:chatId").get(authMiddleware, getChatDetails);
router.route("/").post(authMiddleware, saveChatDetails);
router.route("/:chatId").delete(authMiddleware, deleteChatDetails);

export default router;
