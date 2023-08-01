import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from 'morgan';
import connectDB from "./config/db.js";
import authRoutes from './Routes/authRoute.js';
import categoryRoutes from './Routes/categoryRoute.js'
import productRoutes from './Routes/productRoutes.js'
import cors from "cors"

// Configure ENV
dotenv.config()

// Database Config
connectDB();

//Rest Object
const app = express()

//Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//Rest API
app.get('/', (req,res) => {
      res.send("<h1>Welcome to Monte Carlo </h1>");
});

//PORT
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`.bgGreen.white);
});
