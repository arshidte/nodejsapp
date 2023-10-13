import express from "express";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

//dotenv
import dotenv from "dotenv";
dotenv.config();
//dotenv

import cookieParser from "cookie-parser";

// Database connection
import connectDB from "./config/db.js";
connectDB();
// Database connection


const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

app.use(cookieParser());

// APIs
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
// APIs

app.use(errorHandler);
app.use(notFound);

app.listen(port, () => console.log(`Server running in ${port}`));