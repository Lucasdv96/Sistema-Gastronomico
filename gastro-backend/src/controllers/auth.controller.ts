import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone } = req.body;

      // Validaciones básicas
      if (!name || !email || !password) {
        res.status(400).json({ 
          message: "Nombre, email y contraseña son obligatorios" 
        });
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: "Email inválido" });
        return;
      }

      // Validar longitud de contraseña
      if (password.length < 6) {
        res.status(400).json({ 
          message: "La contraseña debe tener al menos 6 caracteres" 
        });
        return;
      }

      const result = await this.authService.register(name, email, password, phone);

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        data: result,
      });
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Error al registrar usuario",
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validaciones básicas
      if (!email || !password) {
        res.status(400).json({ 
          message: "Email y contraseña son obligatorios" 
        });
        return;
      }

      const result = await this.authService.login(email, password);

      res.status(200).json({
        message: "Login exitoso",
        data: result,
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(401).json({
        message: error instanceof Error ? error.message : "Error al iniciar sesión",
      });
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      // El usuario ya está en req.user gracias al middleware
      res.status(200).json({
        message: "Perfil obtenido",
        data: req.user,
      });
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      res.status(500).json({
        message: "Error al obtener perfil",
      });
    }
  };
}