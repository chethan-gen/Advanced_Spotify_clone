import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
	console.log("=== UPDATING API TOKEN ===");
	console.log("Token received:", token ? "Token present" : "No token");
	if (token) {
		axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		console.log("Authorization header set:", axiosInstance.defaults.headers.common["Authorization"]);
	} else {
		delete axiosInstance.defaults.headers.common["Authorization"];
		console.log("Authorization header removed");
	}
	console.log("========================");
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId } = useAuth();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();

	// Expose token refresh function globally for axios interceptor
	useEffect(() => {
		window.refreshToken = async () => {
			try {
				const newToken = await getToken({ skipCache: true });
				if (newToken) {
					updateApiToken(newToken);
				}
				return newToken;
			} catch (error) {
				console.log("Error refreshing token:", error);
				return null;
			}
		};

		return () => {
			delete window.refreshToken;
		};
	}, [getToken]);

	useEffect(() => {
		const initAuth = async () => {
			try {
				console.log("=== AUTH PROVIDER INIT ===");
				console.log("UserId:", userId);
				console.log("Current axios headers:", axiosInstance.defaults.headers.common);

				const token = await getToken({ skipCache: true }); // Force fresh token
				console.log("Token retrieved:", token ? `Token present (${token.substring(0, 20)}...)` : "No token");

				updateApiToken(token);

				console.log("After updateApiToken - axios headers:", axiosInstance.defaults.headers.common);

				if (token) {
					console.log("Checking admin status...");
					await checkAdminStatus();
					// init socket
					if (userId) initSocket(userId);
				} else {
					console.log("No token - skipping admin check");
				}
				console.log("========================");
			} catch (error: any) {
				console.log("Error in auth provider", error);
				updateApiToken(null);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => disconnectSocket();
	}, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
