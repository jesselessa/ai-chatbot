import express from "express";
import { getUserChats } from "../controllers/userChats.js";

const router = express.Router();

router.get("/", getUserChats);

export default router;
