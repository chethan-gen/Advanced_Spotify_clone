import { axiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types/index";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: any;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;
	unreadCounts: Map<string, number>;
	totalUnreadCount: number;

	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
	fetchUnreadCounts: () => Promise<void>;
	fetchUnreadCountByUser: (userId: string) => Promise<number>;
	markMessagesAsRead: (userId: string) => Promise<void>;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const socket = io(baseURL, {
	autoConnect: false, // only connect if user is authenticated
	withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,
	unreadCounts: new Map(),
	totalUnreadCount: 0,

	setSelectedUser: (user) => set({ selectedUser: user }),

	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/users");
			set({ users: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchUnreadCounts: async () => {
		try {
			const response = await axiosInstance.get("/users/unread-count");
			const { unreadCount } = response.data;
			set({ totalUnreadCount: unreadCount });

			// Fetch unread counts for each user
			const users = get().users;
			const unreadCounts = new Map<string, number>();
			
			for (const user of users) {
				try {
					const userResponse = await axiosInstance.get(`/users/unread-count/${user.clerkId}`);
					const { unreadCount: userUnreadCount } = userResponse.data;
					if (userUnreadCount > 0) {
						unreadCounts.set(user.clerkId, userUnreadCount);
					}
				} catch (error) {
					console.error(`Error fetching unread count for user ${user.clerkId}:`, error);
				}
			}
			
			set({ unreadCounts });
		} catch (error: any) {
			console.error("Error fetching unread counts:", error);
		}
	},

	fetchUnreadCountByUser: async (userId: string) => {
		try {
			const response = await axiosInstance.get(`/users/unread-count/${userId}`);
			return response.data.unreadCount;
		} catch (error: any) {
			console.error("Error fetching unread count by user:", error);
			return 0;
		}
	},

	markMessagesAsRead: async (userId: string) => {
		try {
			await axiosInstance.put(`/users/mark-read/${userId}`);
			
			// Update local state
			set((state) => {
				const newUnreadCounts = new Map(state.unreadCounts);
				newUnreadCounts.delete(userId);
				
				// Recalculate total unread count
				let newTotalUnreadCount = 0;
				for (const count of newUnreadCounts.values()) {
					newTotalUnreadCount += count;
				}
				
				return {
					unreadCounts: newUnreadCounts,
					totalUnreadCount: newTotalUnreadCount,
				};
			});

			// Emit socket event to mark messages as read
			const socket = get().socket;
			if (socket && socket.connected) {
				socket.emit("mark_messages_read", {
					userId: get().selectedUser?.clerkId,
					senderId: userId,
				});
			}
		} catch (error: any) {
			console.error("Error marking messages as read:", error);
		}
	},

	initSocket: (userId) => {
		if (!get().isConnected) {
			console.log("=== INITIALIZING SOCKET ===");
			console.log("User ID:", userId);

			socket.auth = { userId };
			socket.connect();

			console.log("Socket connecting...");
			socket.emit("user_connected", userId);
			console.log("User connected event emitted");

			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("receive_message", (message: Message) => {
				console.log("=== RECEIVED MESSAGE ===");
				console.log("Message:", message);
				set((state) => ({
					messages: [...state.messages, message],
				}));
				console.log("Message added to state");
				console.log("======================");
			});

			socket.on("message_sent", (message: Message) => {
				console.log("=== MESSAGE SENT CONFIRMATION ===");
				console.log("Message:", message);
				set((state) => ({
					messages: [...state.messages, message],
				}));
				console.log("Message added to state");
				console.log("===============================");
			});

			socket.on("new_message_notification", (data: { senderId: string; messageId: string }) => {
				console.log("=== NEW MESSAGE NOTIFICATION ===");
				console.log("Notification data:", data);
				
				// Update unread counts
				set((state) => {
					const newUnreadCounts = new Map(state.unreadCounts);
					const currentCount = newUnreadCounts.get(data.senderId) || 0;
					newUnreadCounts.set(data.senderId, currentCount + 1);
					
					return {
						unreadCounts: newUnreadCounts,
						totalUnreadCount: state.totalUnreadCount + 1,
					};
				});
				
				console.log("Unread counts updated");
				console.log("===============================");
			});

			socket.on("messages_read", (data: { readerId: string }) => {
				console.log("=== MESSAGES READ ===");
				console.log("Reader ID:", data.readerId);
				
				// Update unread counts when messages are read
				set((state) => {
					const newUnreadCounts = new Map(state.unreadCounts);
					const currentCount = newUnreadCounts.get(data.readerId) || 0;
					if (currentCount > 0) {
						newUnreadCounts.set(data.readerId, currentCount - 1);
					}
					
					return {
						unreadCounts: newUnreadCounts,
						totalUnreadCount: Math.max(0, state.totalUnreadCount - 1),
					};
				});
				
				console.log("Unread counts updated after read");
				console.log("========================");
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},

	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: async (receiverId, senderId, content) => {
		console.log("=== FRONTEND SEND MESSAGE ===");
		console.log("Receiver:", receiverId, "Sender:", senderId, "Content:", content);

		const socket = get().socket;
		if (!socket) {
			console.log("No socket connection!");
			return;
		}

		console.log("Socket connected:", socket.connected);
		socket.emit("send_message", { receiverId, senderId, content });
		console.log("Message emitted to socket");
		console.log("============================");
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/users/messages/${userId}`);
			set({ messages: response.data });
			
			// Mark messages as read when fetching them
			await get().markMessagesAsRead(userId);
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
