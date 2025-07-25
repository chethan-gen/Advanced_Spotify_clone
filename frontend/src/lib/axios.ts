import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
});

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Check if error is 401 and we haven't already tried to refresh
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			console.log("Token expired, attempting to refresh...");

			// Try to get a fresh token
			try {
				// We need to get the auth context here
				// This will be set by the AuthProvider
				const refreshTokenFn = (window as any).refreshToken;
				if (refreshTokenFn) {
					const newToken = await refreshTokenFn();
					if (newToken) {
						axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
						originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
						return axiosInstance(originalRequest);
					}
				}
			} catch (refreshError) {
				console.log("Token refresh failed:", refreshError);
			}
		}

		return Promise.reject(error);
	}
);
