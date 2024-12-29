import express from "express";
import {
  getChat,
  addNewChat,
  updateChat,
  deleteChat,
} from "../controllers/chats.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/:chatId", getChat);
router.post("/", upload, addNewChat);
router.put("/:chatId", upload, updateChat);
router.delete("/:chatId", deleteChat);

export default router;
