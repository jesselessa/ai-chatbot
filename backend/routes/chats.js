import express from "express";
import {
  getUserChats,
  getChat,
  addNewChat,
  deleteChat,
} from "../controllers/chats.js";

const router = express.Router();

router.get("/user/:userId", getUserChats);
router.get("/chat/:chatId", getChat);
router.post("/", addNewChat);
router.delete("/:chatId", deleteChat);

export default router;
