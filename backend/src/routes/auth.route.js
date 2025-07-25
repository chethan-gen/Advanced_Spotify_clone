import { Router } from "express";
import { authCallback } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/callback", authCallback);

// Test endpoint to check if authentication is working
router.get("/test", protectRoute, (req, res) => {
	res.json({
		message: "Authentication successful!",
		userId: req.auth.userId,
		isAuthenticated: req.auth.isAuthenticated
	});
});

export default router;
