import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	try {
		const auth = req.auth();
		console.log("=== PROTECT ROUTE DEBUG ===");
		console.log("Request URL:", req.method, req.path);
		console.log("Authorization header:", req.headers.authorization ? "Present" : "MISSING");
		console.log("Authorization value:", req.headers.authorization);
		console.log("All headers:", Object.keys(req.headers));
		console.log("Auth object:", auth);
		console.log("Auth userId:", auth?.userId);
		console.log("Auth isAuthenticated:", auth?.isAuthenticated);
		console.log("========================");

		if (!auth || !auth.userId || !auth.isAuthenticated) {
			console.log("Authentication failed - returning 401");
			return res.status(401).json({ message: "Unauthorized - you must be logged in" });
		}
		req.auth = auth; // Store the auth object for later use
		next();
	} catch (error) {
		console.log("Error in protectRoute:", error);
		return res.status(401).json({ message: "Authentication error" });
	}
};

export const requireAdmin = async (req, res, next) => {
	try {
		console.log("Checking admin for userId:", req.auth.userId); // Debug log
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		console.log("Current user email:", currentUser.primaryEmailAddress?.emailAddress); // Debug log
		console.log("Admin email from env:", process.env.ADMIN_EMAIL); // Debug log

		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (!isAdmin) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next();
	} catch (error) {
		console.log("Error in requireAdmin:", error);
		next(error);
	}
};
