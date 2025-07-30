import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:3000",
			credentials: true,
		},
	});

	const userSockets = new Map(); // { userId: socketId}
	const userActivities = new Map(); // {userId: activity}

	io.on("connection", (socket) => {
		socket.on("user_connected", (userId) => {
			console.log("=== USER CONNECTED ===");
			console.log("User ID:", userId, "Socket ID:", socket.id);

			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			console.log("Current online users:", Array.from(userSockets.keys()));

			// broadcast to all connected sockets that this user just logged in
			io.emit("user_connected", userId);

			socket.emit("users_online", Array.from(userSockets.keys()));

			io.emit("activities", Array.from(userActivities.entries()));
			console.log("===================");
		});

		socket.on("update_activity", ({ userId, activity }) => {
			console.log("activity updated", userId, activity);
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		socket.on("send_message", async (data) => {
			try {
				console.log("=== SEND MESSAGE DEBUG ===");
				console.log("Message data:", data);
				const { senderId, receiverId, content } = data;
				console.log("Sender:", senderId, "Receiver:", receiverId, "Content:", content);

				const message = await Message.create({
					senderId,
					receiverId,
					content,
					read: false,
				});
				console.log("Message created:", message);

				// send to receiver in realtime, if they're online
				const receiverSocketId = userSockets.get(receiverId);
				console.log("Receiver socket ID:", receiverSocketId);
				console.log("Online users:", Array.from(userSockets.keys()));

				if (receiverSocketId) {
					io.to(receiverSocketId).emit("receive_message", message);
					io.to(receiverSocketId).emit("new_message_notification", {
						senderId,
						messageId: message._id,
					});
					console.log("Message sent to receiver");
				} else {
					console.log("Receiver not online");
				}

				socket.emit("message_sent", message);
				console.log("Message sent confirmation to sender");
				console.log("========================");
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		socket.on("mark_messages_read", async (data) => {
			try {
				const { userId, senderId } = data;
				
				await Message.updateMany(
					{
						senderId: senderId,
						receiverId: userId,
						read: false,
					},
					{
						read: true,
					}
				);

				// Notify the sender that their messages have been read
				const senderSocketId = userSockets.get(senderId);
				if (senderSocketId) {
					io.to(senderSocketId).emit("messages_read", { readerId: userId });
				}

				socket.emit("messages_marked_read");
			} catch (error) {
				console.error("Mark messages read error:", error);
				socket.emit("mark_read_error", error.message);
			}
		});

		socket.on("disconnect", () => {
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				// find disconnected user
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};
