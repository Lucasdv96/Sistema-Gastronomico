import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { AppDataSource } from '../config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//MIDDLEWARES
app.use(cors());
app.use(express.json());


//ROUTES
app.get("/health", (_, res) => {
  res.json({ 
    status: "ok",
    database: AppDataSource.isInitialized ? "connected" : "disconnected"
  });
}); 

//INITIALIZE DATABASE AND START SERVER
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during database initialization:", error);  
  process.exit(1);
  });

export default app;