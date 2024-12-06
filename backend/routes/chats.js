import express from "express";
import {
  getChat,
  addNewChat,
  updateChat,
  deleteChat,
} from "../controllers/chats.js";

const router = express.Router();

router.get("/:id", getChat);
router.post("/", addNewChat);
router.put("/:id", updateChat);
router.delete("/:id", deleteChat);

export default router;
