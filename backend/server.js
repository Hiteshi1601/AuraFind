// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { compareImages } from "./compare.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ----------- Ensure uploads folder exists -----------
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ----------- Multer Storage -----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ----------- Test Route -----------
app.get("/", (req, res) => {
  res.send("Backend Running ✔");
});

// ----------- Image Compare API -----------
app.post(
  "/api/compare",
  upload.fields([
    { name: "userImage", maxCount: 1 },
    { name: "cctvImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files["userImage"] || !req.files["cctvImage"]) {
        return res.status(400).json({ error: "Images not uploaded" });
      }

      const userImage = req.files["userImage"][0].path;
      const cctvImage = req.files["cctvImage"][0].path;

      const diffValue = await compareImages(userImage, cctvImage); // returns 0–1 number

      const similarityPercent = ((1 - diffValue) * 100).toFixed(2);

      res.json({
        similarity: similarityPercent + "%",
        matched: diffValue < 0.25, // <25% difference means match (75% similarity)
      });
    } catch (err) {
      console.error("COMPARE ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ----------- Connect MongoDB -----------
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Error:", err));
} else {
  console.log("No MONGO_URI environment variable set. Database connection skipped.");
}

// ----------- Start Server -----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));