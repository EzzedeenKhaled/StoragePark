import express from "express";
import path from "path";
import fs from "fs"; // ES module way of importing fs
import { connectDB } from "./lib/db.js";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Change this to your frontend URL
    credentials: true, // Allow cookies & auth headers
    methods: "GET,POST,PUT,DELETE",
  })
);

// Create 'uploads' directory if it doesn't exist
const uploadDir = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Uploads directory created.');
}

// Serve static files (like images)
app.use("/uploads", express.static(uploadDir));

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
