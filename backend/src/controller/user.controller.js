import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		console.log("=== GET MESSAGES DEBUG ===");
		const myId = req.auth.userId;
		const { userId } = req.params;
		console.log("My ID:", myId, "Other user ID:", userId);

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		console.log("Found messages:", messages.length);
		console.log("Messages:", messages);
		console.log("========================");

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages:", error);
		next(error);
	}
};

export const getUnreadCount = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		
		const unreadCount = await Message.countDocuments({
			receiverId: myId,
			read: false,
		});

		res.status(200).json({ unreadCount });
	} catch (error) {
		next(error);
	}
};

export const getUnreadCountByUser = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;
		
		const unreadCount = await Message.countDocuments({
			senderId: userId,
			receiverId: myId,
			read: false,
		});

		res.status(200).json({ unreadCount });
	} catch (error) {
		next(error);
	}
};

export const markMessagesAsRead = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;
		
		await Message.updateMany(
			{
				senderId: userId,
				receiverId: myId,
				read: false,
			},
			{
				read: true,
			}
		);

		res.status(200).json({ message: "Messages marked as read" });
	} catch (error) {
		next(error);
	}
};
