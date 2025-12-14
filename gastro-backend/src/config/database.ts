import { DataSource } from "typeorm";
import { User } from "../entities/User.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Delvalle.dv25",
  database: process.env.DB_NAME || "gastro_db",
  synchronize: process.env.NODE_ENV !== "production", // Auto-crear tablas en desarrollo
  logging: process.env.NODE_ENV !== "production",
  entities: [User],
  migrations: [],
  subscribers: [],
});