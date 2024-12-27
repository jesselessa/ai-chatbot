import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";

// Get a specific chat
export const getChat = async (req, res) => {
  const { userId } = req.auth; // Safely retrieve userId from req.auth
  const { id: chatId } = req.params;

  try {
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ error: "Error fetching chat" });
  }
};

// Add a new chat
export const addNewChat = async (req, res) => {
  const { userId } = req.auth;
  const { text } = req.body;
  // const { text, img } = req.body;

  try {
    // Create a new chat with or without image
    const newChat = new Chat({
      userId,
      history: [{ role: "user", parts: [{ text }] }],
      // history: [{ role: "user", parts: [{ text }], ...(img && { img }) }],
    });

    const savedChat = await newChat.save();

    const userChats = await UserChats.findOne({ userId });

    if (!userChats) {
      // If it's user first chat
      await new UserChats({
        userId,
        chats: [{ _id: savedChat._id, title: text.substring(0, 40) }],
      }).save();
    } else {
      // Add chat to user chats list
      userChats.chats.push({
        _id: savedChat._id,
        title: text.substring(0, 40),
      });
      await userChats.save();
    }

    res
      .status(201)
      .json({ message: "Chat saved successfully", chatId: savedChat._id });
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ error: "Error creating chat" });
  }
};

// Update a chat
export const updateChat = async (req, res) => {
  const { userId } = req.auth;
  const { id: chatId } = req.params;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: chatId, userId },
      { $push: { history: { $each: newItems } } }
    );
    res.status(200).json(updatedChat);
  } catch (err) {
    console.error("Error updating chat:", err);
    res.status(500).json({ error: "Error updating chat" });
  }
};

// Delete a chat
export const deleteChat = async (req, res) => {
  const { userId } = req.auth;
  const { id: chatId } = req.params;

  try {
    const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: chatId } } }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).json({ error: "Error deleting chat" });
  }
};
