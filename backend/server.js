import "dotenv/config";
import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import url, { fileURLToPath } from "url";
import mongoose from "mongoose";
import ImageKit from "imagekit";
import { clerkMiddleware } from "@clerk/express";
import chatsRoute from "./routes/chats.js";
import userChatsRoute from "./routes/userChats.js";

const PORT = process.env.PORT || 8000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//* Allow cross-origin requests
app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.SERVER_URL],
    credentials: true,
  })
);

//* Parse incoming requests with JSON payload
app.use(express.json());

//* Configure MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};

//* Configure ImageKit
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

// Get IK authentication info
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

//* Configure Clerk
//! clerkMiddleware() checks the request's cookies and headers for a session JWT and, if found, attaches the Auth object to the request object under the 'auth' key
app.use(clerkMiddleware());

// Get authentication info
app.get("/api/auth-state", (req, res) => {
  res.json(req.auth);
});

// Check if user is authenticated
const handleAuthErrors = (req, res, next) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ error: "Unauthenticated user" });
  }
  next();
};

//* Protected routes
app.use("/api/chats", handleAuthErrors, chatsRoute);
app.use("/api/user-chats", handleAuthErrors, userChatsRoute);

//* Serve static files in production
// TODO Uncomment below in production
// app.use(express.static(path.join(__dirname, "../client/dist")));

//* Handle undefined routes
app.get("*", (_req, res) => {
  res.send("Page not found !");
});

//* Handle errors globally
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

//* Start server and launch database
app.listen(PORT, () => {
  connect();
  console.log(`Server is listening at http://localhost:${PORT}`);
});
