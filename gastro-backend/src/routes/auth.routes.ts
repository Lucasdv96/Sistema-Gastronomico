import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();
const authController = new AuthController();

// Rutas públicas
router.post("/register", authController.register);
router.post("/login", authController.login);

// Rutas protegidas
router.get("/profile", authMiddleware, authController.getProfile);

export default router;