import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";
import { generateResponse } from "../config/gemini.js";
import mongoose from "mongoose";
import { generateChatTitle } from "../utils/chatTitle.js";

/*
 * Every function is associated to a protected route where user must
 * be authenticated
 */

//? A Mongoose transaction is a database operation that groups multiple operations (document creation, update, deletion) into a single unit. Either all operations succeed, or none of them do.

//* Get a single chat by its ID
export const getChat = async (req, res, next) => {
  const { userId } = req.auth; // Get ID from Clerk auth info
  const { chatId } = req.params;

  try {
    // Fetch chat based on its ID and user ID
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    next(err); // Propagate error to global middleware
  }
};

//* Add a new chat
export const addNewChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { text } = req.body;

  // Start a transaction session to ensure atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create a new chat instance with the initial user message
    const newChat = new Chat({
      userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    // Save the new chat within the transaction
    const savedChat = await newChat.save({ session });
    const chatTitle = generateChatTitle(text);

    // Update the user's chat collection
    await UserChats.findOneAndUpdate(
      { userId },
      {
        $push: {
          chats: {
            _id: savedChat._id,
            title: chatTitle,
            updatedAt: new Date(),
          },
        },
      },
      { new: true, upsert: true, session }
    );

    // Commit the transaction if all operations are successful
    await session.commitTransaction();
    res.status(201).json({
      message: "Chat saved successfully",
      chatId: savedChat._id,
    });
  } catch (err) {
    // Rollback the transaction on error
    await session.abortTransaction();
    console.error("Error creating chat:", err);
    next(err);
  } finally {
    // End the session
    session.endSession();
  }
};

//* Update a chat with a new user message
export const updateChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { chatId } = req.params;
  const { question, img } = req.body; // img = image URL

  try {
    // Retrieve existing chat to get complete history
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Prepare chat history for Gemini model
    let aiChatHistory = chat.history
      .filter((message) => message?.role && message?.parts)
      .map(({ role, parts }) => ({
        role,
        parts: parts.map(({ text }) => ({ text })),
      }));

    // Add the new user question to both histories
    if (question) {
      chat.history.push({
        role: "user",
        parts: [{ text: question }],
        ...(img && { img }),
      });

      aiChatHistory.push({
        role: "user",
        parts: [{ text: question }],
      });
    }

    // Generate AI response
    const aiResponse = await generateResponse(aiChatHistory, img);

    // Add AI response to the chat history
    chat.history.push({ role: "model", parts: [{ text: aiResponse }] });

    // Save the updated chat document
    await chat.save();

    // Define chat title based on input type
    const chatTitle = generateChatTitle(question, img);

    // Update chat title and update date in user chat collection
    await UserChats.updateOne(
      { userId, "chats._id": chatId },
      {
        $set: {
          "chats.$.title": chatTitle,
          "chats.$.updatedAt": new Date(),
        },
      }
    );

    res.status(200).json({ message: "Chat updated successfully" });
  } catch (err) {
    console.error("Error updating chat:", err);
    next(err);
  }
};

//* Delete a chat and its reference from user's collection
export const deleteChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { chatId } = req.params;

  // Start a transaction session to ensure atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find and delete chat within the transaction
    const chat = await Chat.findOneAndDelete(
      { _id: chatId, userId },
      { session }
    );
    if (!chat) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Chat not found" });
    }

    // Remove chat reference from user's chat collection within the transaction
    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: chatId } } },
      { session }
    );

    // Commit the transaction if all operations are successful
    await session.commitTransaction();
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    // Rollback the transaction on error
    await session.abortTransaction();
    console.error("Error deleting chat:", err);
    next(err);
  } finally {
    // End the session
    session.endSession();
  }
};
