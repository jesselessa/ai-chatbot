import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";
import util from "util";
import { generateResponse } from "../config/gemini.js";

export const getChat = async (req, res, next) => {
  const { userId } = req.auth; // Get ID from Clerk auth info
  const { chatId } = req.params;

  try {
    // Fetch chat based on its ID and user ID
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat)
      return res
        .status(404)
        .json({ message: "Chat not found or unauthorized" });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    next(err); // Propagate error to global middleware
  }
};

export const addNewChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { text } = req.body;

  try {
    // Create a new chat instance with initial user message
    const newChat = new Chat({
      userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    const savedChat = await newChat.save(); // Send chat to database
    const chatTitle = text?.length > 40 ? `${text.substring(0, 40)}...` : text; // Define chat title (limited to 1st 40 characters)

    // Check if user already has a chat collection
    const userChats = await UserChats.findOne({ userId });

    if (!userChats) {
      // If not, create a new one and add chat
      await new UserChats({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title: chatTitle,
          },
        ],
      }).save();
    } else {
      // If user already has a chat collection, update it
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: chatTitle,
            },
          },
        },
        { upsert: true }
      );
    }

    res.status(201).json({
      message: "Chat saved successfully",
      chatId: savedChat._id,
    });
  } catch (err) {
    console.error("Error creating chat:", err);
    next(err);
  }
};

export const updateChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { chatId } = req.params;
  const { question, img } = req.body; // img = image URL

  try {
    // Retrieve existing chat to get complete history
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found or unauthorized" });
    }

    // Initialize MongoDB chat history
    let dbChatHistory = chat.history;

    // Initialize Gemini chat history (without MongoDB "_id" and "img" keys to fit AI model)
    let aiChatHistory = dbChatHistory
      .filter((message) => message?.role && message?.parts)
      .map(({ role, parts }) => ({
        role,
        parts: parts.map(({ text }) => ({ text })),
      }));

    // Add user question to MongoDB et Gemini chat histories
    if (question) {
      dbChatHistory.push({
        role: "user",
        parts: [{ text: question }],
        ...(img && { img }), // Optional image URL
      });

      aiChatHistory.push({
        role: "user",
        parts: [{ text: question }],
      });
    }

    // Generate AI response
    const aiResponse = await generateResponse(aiChatHistory, img);

    // Add AI response to chat histories
    dbChatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
    aiChatHistory.push({ role: "model", parts: [{ text: aiResponse }] });

    // Update chat data in database
    const updatedChat = await Chat.updateOne(
      { _id: chatId, userId },
      { $set: { history: dbChatHistory } }
    );

    // Check if update is effective
    if (updatedChat.matchedCount === 0)
      // No document matches search criteria
      return res
        .status(404)
        .json({ message: "Chat not found or unauthorized" });

    // Define chat title based on input type
    const chatTitle = img
      ? "Image Analyze"
      : question?.length > 40
      ? `${question.substring(0, 40)}...`
      : question;

    // Update chat title in user chat collection
    await UserChats.updateOne(
      { userId, "chats._id": chatId },
      {
        $set: {
          "chats.$.title": chatTitle,
        },
      }
    );

    res.status(200).json({ message: "Chat updated successfully" });
  } catch (err) {
    console.error("Error updating chat:", err);
    next(err);
  }
};

export const deleteChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { chatId } = req.params;

  try {
    // Find and delete chat
    const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Remove chat reference from user's chat collection
    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: chatId } } }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Error deleting chat:", err);
    next(err);
  }
};
