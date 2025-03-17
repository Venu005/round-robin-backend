import "dotenv/config";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import { securityHeaders } from "./middleware/security.js"; // Removed rate limiter
import couponRoutes from "./routes/couponRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";
import { logger } from "./utils/logger.js";
import { verifyAuth } from "./middleware/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Database connection
connectDB();

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

// Middleware
app.use(cookieParser());
app.use(securityHeaders);
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", verifyAuth, adminRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
