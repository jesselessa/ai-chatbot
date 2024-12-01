import "dotenv/config";
import express from "express";

const PORT = process.env.PORT;
const app = express();

app.get("/api/upload", (req, res) => {
  res.send("It works !");
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
