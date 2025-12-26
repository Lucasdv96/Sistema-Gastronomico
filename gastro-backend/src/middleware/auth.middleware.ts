import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/user.service.js";

// Extender el tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No autorizado - Token no proporcionado" });
      return;
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    const authService = new AuthService();
    const decoded = authService.verifyToken(token);

    // Obtener usuario
    const userService = new UserService();
    const user = await userService.findUserById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "No autorizado - Usuario no encontrado" });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ message: "No autorizado - Usuario inactivo" });
      return;
    }

    // Agregar usuario al request (sin password)
    const { password: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    res.status(401).json({ 
      message: "No autorizado - Token inválido",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};