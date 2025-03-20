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
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//* Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      // Define an array of allowed URLs to access the API
      const allowedOrigins = [
        "https://www.ai-chatbot.jesselessa.dev",
        "https://ai-chatbot.jesselessa.dev",
      ];
      // Check if the origin is in the allowedOrigins array
      // If the origin is not provided (e.g., for same-origin requests), allow it
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        // Allow the request by calling the callback with null (no error) and true (allow)
        callback(null, true);
      } else {
        // Deny the request by calling the callback with an error and false
        callback(new Error("Not allowed by CORS"));
      }
    },
    // Allow sending cookies in cross-origin requests
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware()); //! ClerkMiddleware checks the request cookies and headers for a session JWT and, if found, attaches the Auth object to the request object under the 'auth' key

//* Routes
// ImageKit authentication info
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// Clerk authentication info
app.get("/api/auth-state", (req, res) => {
  return res.json(req.auth);
});

// Protected "chats" routes
app.use("/api/chats", handleAuthErrors, chatsRoute);
app.use("/api/user-chats", handleAuthErrors, userChatsRoute);

//* Serve static files in production
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

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
  console.log(`Server running on port ${port}`);
});
