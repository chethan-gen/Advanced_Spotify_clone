import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
	getAllUsers, 
	getMessages, 
	getUnreadCount, 
	getUnreadCountByUser, 
	markMessagesAsRead 
} from "../controller/user.controller.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.get("/unread-count", protectRoute, getUnreadCount);
router.get("/unread-count/:userId", protectRoute, getUnreadCountByUser);
router.put("/mark-read/:userId", protectRoute, markMessagesAsRead);

export default router;
