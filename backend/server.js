import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
// Configurations and middlewares
import { connectDB } from "./config/db.js";
import { imagekit } from "./config/imageKit.js";
import { handleAuthErrors } from "./middlewares/handleAuthErrors.js";
// Routes
import chatsRoute from "./routes/chats.js";
import userChatsRoute from "./routes/userChats.js";

const app = express();
const port = process.env.PORT || 8000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//* Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware()); //! ClerkMiddleware checks the request cookies and headers for a session JWT and, if found, attaches the Auth object to the request object under the 'auth' key

//* Routes
// ImageKit authentication info
app.get("/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// Clerk authentication info
app.get("/auth-state", (req, res) => {
  return res.json(req.auth);
});

// Protected "chats" routes
app.use("/chats", handleAuthErrors, chatsRoute);
app.use("/user-chats", handleAuthErrors, userChatsRoute);

//* Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Redirect all unknown routes to the client-side application
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

//* Handle undefined routes for non-production environments
if (process.env.NODE_ENV !== "production") {
  app.get("*", (req, res) => {
    res.status(404).json({ error: "Page not found!" });
  });
}

//* Handle errors globally
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

//* Start server and connect to database
app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});
