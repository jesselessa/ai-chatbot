import express from "express";
import cors from "cors";
import ImageKit from "imagekit";

const PORT = process.env.PORT || 5000;
const app = express();

// Allow cross-origin requests
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Configure ImageKit authentication
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

// Token info received after ImageKit authentication
app.get("/api/upload", (_req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// Handle routes not set by API
app.get("*", (_req, res) => {
  res.send("Page not found");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
