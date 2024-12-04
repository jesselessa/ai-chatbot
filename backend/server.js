import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import ImageKit from "imagekit";
import chatsRoute from "./routes/chats.js"; // Chats routes

const PORT = process.env.PORT || 5000;
const app = express();

// Allow cross-origin requests
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Parse incoming requests in JSON
app.use(express.json());

// Configure Mongoose
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to database:", err);
  }
};

// Configure ImageKit
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

// ImageKit authentication info
app.get("/api/upload", (_req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// API routes
app.use("/api/chats", chatsRoute);

// Handle routes not set by API
app.get("*", (_req, res) => {
  res.send("Page not found");
});

// Start server and connect to database
app.listen(PORT, () => {
  connect();
  console.log(`Server listening at http://localhost:${PORT}`);
});
