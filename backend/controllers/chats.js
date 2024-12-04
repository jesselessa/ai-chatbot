import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";

// Get all user chats
export const getUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const userChats = await UserChats.findOne({ userId });

    if (!userChats) {
      return res.status(404).json({ message: "No chats found for this user" });
    }

    res.status(200).json(userChats.chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Error fetching chats" });
  }
};

// Get a single chat
export const getChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);

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
  const { userId, history, title } = req.body;

  try {
    // Create a Chat
    const chat = new Chat({ userId, history });
    await chat.save();

    // Add chat to userChats model
    const userChats = await UserChats.findOne({ userId });

    if (!userChats) {
      // If user doesn't already have chats, create new one
      await new UserChats({
        userId,
        chats: [{ _id: chat._id, title, createdAt: chat.createdAt }],
      }).save();
    } else {
      // Add chat to existing list
      userChats.chats.push({ _id: chat._id, title, createdAt: chat.createdAt });
      await userChats.save();
    }

    res.status(201).json({ message: "Chat saved successfully", chat });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error saving chat" });
  }
};

export const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Remove chat from userChats model
    await UserChats.updateOne(
      { userId: chat.userId },
      { $pull: { chats: { _id: chatId } } }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).json({ error: "Error deleting chat" });
  }
};
