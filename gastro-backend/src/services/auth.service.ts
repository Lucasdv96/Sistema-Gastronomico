import jwt, { SignOptions } from "jsonwebtoken";
import { UserService } from "./user.service.js";

export class AuthService {
  private userService = new UserService();

  async register(name: string, email: string, password: string, phone?: string) {
    const user = await this.userService.createUser(name, email, password, phone);
    const token = this.generateToken(user.id);

    return {
      user,
      token,
    };
  }

  async login(email: string, password: string) {
    // Buscar usuario
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    // Verificar contraseña
    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas");
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new Error("Usuario inactivo");
    }

    // Generar token
    const token = this.generateToken(user.id);

    // Retornar sin la contraseña
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error("JWT_SECRET no está configurado");
    }

    const payload = { userId };
    const options: SignOptions = { 
      expiresIn: process.env.JWT_EXPIRES_IN || "7d" 
    };

    return jwt.sign(payload, secret, options);
  }

  verifyToken(token: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET no está configurado");
    }

    try {
      return jwt.verify(token, secret) as { userId: string };
    } catch (error) {
      throw new Error("Token inválido");
    }
  }
}