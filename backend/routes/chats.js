import express from "express";
import {
  getChat,
  addNewChat,
  updateChat,
  deleteChat,
} from "../controllers/chats.js";

const router = express.Router();

router.get("/:chatId", getChat);
router.post("/", addNewChat);
router.put("/:chatId", updateChat);
router.delete("/:chatId", deleteChat);

export default router;
